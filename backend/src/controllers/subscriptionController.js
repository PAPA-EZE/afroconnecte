import Stripe from "stripe"
import { User, Subscription, Plan } from "../models/index.js"
import { Op } from "sequelize"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({
      where: { is_active: true },
      order: [["price_monthly", "ASC"]],
    })

    res.json({
      success: true,
      data: { plans },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des plans.",
    })
  }
}

export const getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        user_id: req.user.id,
        status: { [Op.in]: ["active", "trial"] },
        end_date: { [Op.gt]: new Date() },
      },
      include: ["plan"],
      order: [["created_at", "DESC"]],
    })

    res.json({
      success: true,
      data: {
        subscription,
        is_premium: !!subscription,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'abonnement.",
    })
  }
}

export const createCheckoutSession = async (req, res) => {
  try {
    const { plan_id, billing_period = "monthly" } = req.body

    const plan = await Plan.findByPk(plan_id)
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan non trouvé.",
      })
    }

    const priceId = billing_period === "yearly" ? plan.stripe_price_id_yearly : plan.stripe_price_id_monthly

    if (!priceId) {
      return res.status(400).json({
        success: false,
        message: "Ce plan n'est pas disponible pour cette période.",
      })
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: req.user.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.FRONTEND_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/premium`,
      metadata: {
        user_id: req.user.id,
        plan_id: plan.id,
      },
    })

    res.json({
      success: true,
      data: {
        checkout_url: session.url,
        session_id: session.id,
      },
    })
  } catch (error) {
    console.error("Erreur createCheckoutSession:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la session de paiement.",
    })
  }
}

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      await handleCheckoutComplete(session)
      break
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object
      await handleSubscriptionUpdate(subscription)
      break
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object
      await handleSubscriptionCancelled(subscription)
      break
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object
      await handlePaymentFailed(invoice)
      break
    }
  }

  res.json({ received: true })
}

async function handleCheckoutComplete(session) {
  const { user_id, plan_id } = session.metadata

  const plan = await Plan.findByPk(plan_id)

  // Calculer la date de fin
  const startDate = new Date()
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + 1) // 1 mois par défaut

  await Subscription.create({
    user_id,
    plan_id,
    status: "active",
    payment_provider: "stripe",
    payment_provider_subscription_id: session.subscription,
    start_date: startDate,
    end_date: endDate,
    amount_paid: session.amount_total / 100,
    currency: session.currency.toUpperCase(),
  })

  // Mettre à jour le statut premium de l'utilisateur
  await User.update({ is_premium: true }, { where: { id: user_id } })
}

async function handleSubscriptionUpdate(stripeSubscription) {
  const subscription = await Subscription.findOne({
    where: { payment_provider_subscription_id: stripeSubscription.id },
  })

  if (subscription) {
    await subscription.update({
      status: stripeSubscription.status === "active" ? "active" : "cancelled",
      end_date: new Date(stripeSubscription.current_period_end * 1000),
    })
  }
}

async function handleSubscriptionCancelled(stripeSubscription) {
  const subscription = await Subscription.findOne({
    where: { payment_provider_subscription_id: stripeSubscription.id },
  })

  if (subscription) {
    await subscription.update({
      status: "cancelled",
      cancelled_at: new Date(),
    })

    // Vérifier si l'utilisateur a d'autres abonnements actifs
    const activeSubscriptions = await Subscription.count({
      where: {
        user_id: subscription.user_id,
        status: "active",
        end_date: { [Op.gt]: new Date() },
      },
    })

    if (activeSubscriptions === 0) {
      await User.update({ is_premium: false }, { where: { id: subscription.user_id } })
    }
  }
}

async function handlePaymentFailed(invoice) {
  // Notifier l'utilisateur du paiement échoué
  console.log("Payment failed for invoice:", invoice.id)
}

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        user_id: req.user.id,
        status: "active",
      },
    })

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Aucun abonnement actif trouvé.",
      })
    }

    // Annuler sur Stripe
    if (subscription.payment_provider_subscription_id) {
      await stripe.subscriptions.update(subscription.payment_provider_subscription_id, {
        cancel_at_period_end: true,
      })
    }

    await subscription.update({
      cancelled_at: new Date(),
    })

    res.json({
      success: true,
      message: "Votre abonnement sera annulé à la fin de la période en cours.",
      data: {
        end_date: subscription.end_date,
      },
    })
  } catch (error) {
    console.error("Erreur cancelSubscription:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'annulation.",
    })
  }
}
