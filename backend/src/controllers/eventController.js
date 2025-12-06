import { Event, EventParticipant, User, Photo } from "../models/index.js"
import { Op } from "sequelize"

export const getEvents = async (req, res) => {
  try {
    const { category, city, country, start_date, end_date, page = 1, limit = 20 } = req.query

    const where = {
      is_approved: true,
      start_date: { [Op.gte]: new Date() },
    }

    if (category) where.category = category
    if (city) where.city = { [Op.like]: `%${city}%` }
    if (country) where.country = country
    if (start_date) where.start_date = { [Op.gte]: new Date(start_date) }
    if (end_date) where.start_date = { ...where.start_date, [Op.lte]: new Date(end_date) }

    const offset = (page - 1) * limit

    const events = await Event.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["id", "first_name", "is_verified"],
          include: [
            {
              model: Photo,
              as: "photos",
              where: { is_primary: true },
              required: false,
            },
          ],
        },
        {
          model: User,
          as: "participants",
          attributes: ["id", "first_name"],
          through: { attributes: ["status"] },
          include: [
            {
              model: Photo,
              as: "photos",
              where: { is_primary: true },
              required: false,
            },
          ],
        },
      ],
      order: [
        ["is_featured", "DESC"],
        ["start_date", "ASC"],
      ],
      limit: Number.parseInt(limit),
      offset,
    })

    const formattedEvents = events.rows.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      image_url: event.image_url,
      start_date: event.start_date,
      end_date: event.end_date,
      location_name: event.location_name,
      address: event.address,
      city: event.city,
      country: event.country,
      is_online: event.is_online,
      online_link: event.is_online ? event.online_link : null,
      is_featured: event.is_featured,
      max_participants: event.max_participants,
      participants_count: event.participants?.length || 0,
      organizer: event.organizer
        ? {
            id: event.organizer.id,
            first_name: event.organizer.first_name,
            is_verified: event.organizer.is_verified,
            photo: event.organizer.photos?.[0]?.url,
          }
        : null,
      participants_preview:
        event.participants?.slice(0, 5).map((p) => ({
          id: p.id,
          first_name: p.first_name,
          photo: p.photos?.[0]?.url,
        })) || [],
    }))

    res.json({
      success: true,
      data: {
        events: formattedEvents,
        pagination: {
          total: events.count,
          page: Number.parseInt(page),
          pages: Math.ceil(events.count / limit),
        },
      },
    })
  } catch (error) {
    console.error("Erreur getEvents:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des événements.",
    })
  }
}

export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params

    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: User,
          as: "organizer",
          attributes: ["id", "first_name", "is_verified"],
          include: [
            {
              model: Photo,
              as: "photos",
              where: { is_primary: true },
              required: false,
            },
          ],
        },
        {
          model: User,
          as: "participants",
          attributes: ["id", "first_name"],
          through: { attributes: ["status"] },
          include: [
            {
              model: Photo,
              as: "photos",
              where: { is_primary: true },
              required: false,
            },
          ],
        },
      ],
    })

    if (!event || !event.is_approved) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé.",
      })
    }

    // Vérifier si l'utilisateur participe
    const userParticipation = await EventParticipant.findOne({
      where: {
        event_id: eventId,
        user_id: req.user.id,
      },
    })

    res.json({
      success: true,
      data: {
        event: {
          ...event.toJSON(),
          user_status: userParticipation?.status || null,
          participants: event.participants?.map((p) => ({
            id: p.id,
            first_name: p.first_name,
            photo: p.photos?.[0]?.url,
            status: p.EventParticipant?.status,
          })),
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'événement.",
    })
  }
}

export const participateEvent = async (req, res) => {
  try {
    const { eventId } = req.params
    const { status = "interested" } = req.body // 'interested' ou 'going'

    const event = await Event.findByPk(eventId)

    if (!event || !event.is_approved) {
      return res.status(404).json({
        success: false,
        message: "Événement non trouvé.",
      })
    }

    // Vérifier la limite de participants
    if (event.max_participants) {
      const goingCount = await EventParticipant.count({
        where: { event_id: eventId, status: "going" },
      })

      if (status === "going" && goingCount >= event.max_participants) {
        return res.status(400).json({
          success: false,
          message: "Cet événement est complet.",
        })
      }
    }

    const [participation, created] = await EventParticipant.findOrCreate({
      where: { event_id: eventId, user_id: req.user.id },
      defaults: { status },
    })

    if (!created) {
      await participation.update({ status })
    }

    res.json({
      success: true,
      message: status === "going" ? "Vous participez à cet événement !" : "Vous êtes intéressé par cet événement.",
      data: { status },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription.",
    })
  }
}

export const cancelParticipation = async (req, res) => {
  try {
    const { eventId } = req.params

    await EventParticipant.destroy({
      where: {
        event_id: eventId,
        user_id: req.user.id,
      },
    })

    res.json({
      success: true,
      message: "Participation annulée.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'annulation.",
    })
  }
}

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      image_url,
      start_date,
      end_date,
      location_name,
      address,
      city,
      country,
      latitude,
      longitude,
      max_participants,
      is_online,
      online_link,
    } = req.body

    const event = await Event.create({
      organizer_id: req.user.id,
      title,
      description,
      category,
      image_url,
      start_date,
      end_date,
      location_name,
      address,
      city,
      country,
      latitude,
      longitude,
      max_participants,
      is_online,
      online_link,
      is_approved: false, // Nécessite une approbation admin
    })

    res.status(201).json({
      success: true,
      message: "Événement créé. Il sera visible après validation.",
      data: { event },
    })
  } catch (error) {
    console.error("Erreur createEvent:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'événement.",
    })
  }
}

export const getMyEvents = async (req, res) => {
  try {
    // Événements organisés
    const organized = await Event.findAll({
      where: { organizer_id: req.user.id },
      order: [["start_date", "ASC"]],
    })

    // Événements auxquels je participe
    const participating = await EventParticipant.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Event,
          as: "event",
        },
      ],
    })

    res.json({
      success: true,
      data: {
        organized,
        participating: participating.map((p) => ({
          ...p.event.toJSON(),
          my_status: p.status,
        })),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des événements.",
    })
  }
}
