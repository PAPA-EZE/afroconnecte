import multer from "multer"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import { Photo, User } from "../models/index.js"
import { Op } from "sequelize" // Import Op from sequelize

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || "./uploads"
    const userPath = path.join(uploadPath, "photos", req.user.id)

    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, { recursive: true })
    }

    cb(null, userPath)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Type de fichier non autorisé. Utilisez JPG, PNG ou WEBP."), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number.parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
})

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucune image fournie.",
      })
    }

    // Vérifier le nombre de photos
    const photoCount = await Photo.count({ where: { user_id: req.user.id } })

    if (photoCount >= 6) {
      // Supprimer le fichier uploadé
      fs.unlinkSync(req.file.path)

      return res.status(400).json({
        success: false,
        message: "Vous avez atteint la limite de 6 photos.",
      })
    }

    const photoUrl = `/uploads/photos/${req.user.id}/${req.file.filename}`

    // Définir comme photo principale si c'est la première
    const isPrimary = photoCount === 0

    const photo = await Photo.create({
      user_id: req.user.id,
      url: photoUrl,
      is_primary: isPrimary,
      order: photoCount,
      moderation_status: "pending",
    })

    res.status(201).json({
      success: true,
      message: "Photo uploadée avec succès.",
      data: { photo },
    })
  } catch (error) {
    console.error("Erreur uploadPhoto:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload de la photo.",
    })
  }
}

export const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({
      where: { user_id: req.user.id },
      order: [["order", "ASC"]],
    })

    res.json({
      success: true,
      data: { photos },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des photos.",
    })
  }
}

export const deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params

    const photo = await Photo.findOne({
      where: { id: photoId, user_id: req.user.id },
    })

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo non trouvée.",
      })
    }

    // Supprimer le fichier physique
    const filePath = path.join(process.cwd(), photo.url)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Si c'était la photo principale, définir une autre comme principale
    if (photo.is_primary) {
      const nextPhoto = await Photo.findOne({
        where: { user_id: req.user.id, id: { [Op.ne]: photoId } },
        order: [["order", "ASC"]],
      })

      if (nextPhoto) {
        await nextPhoto.update({ is_primary: true })
      }
    }

    await photo.destroy()

    res.json({
      success: true,
      message: "Photo supprimée.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la photo.",
    })
  }
}

export const setPrimaryPhoto = async (req, res) => {
  try {
    const { photoId } = req.params

    // Retirer le statut primary de toutes les photos
    await Photo.update({ is_primary: false }, { where: { user_id: req.user.id } })

    // Définir la nouvelle photo principale
    const [updated] = await Photo.update({ is_primary: true }, { where: { id: photoId, user_id: req.user.id } })

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Photo non trouvée.",
      })
    }

    res.json({
      success: true,
      message: "Photo principale mise à jour.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour.",
    })
  }
}

export const reorderPhotos = async (req, res) => {
  try {
    const { order } = req.body // [{ id, order }]

    for (const item of order) {
      await Photo.update({ order: item.order }, { where: { id: item.id, user_id: req.user.id } })
    }

    res.json({
      success: true,
      message: "Ordre des photos mis à jour.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réorganisation.",
    })
  }
}

// Vérification de profil par photo
export const uploadVerificationPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucune image fournie.",
      })
    }

    const photoUrl = `/uploads/photos/${req.user.id}/${req.file.filename}`

    await User.update({ verification_photo: photoUrl }, { where: { id: req.user.id } })

    // La vérification sera traitée manuellement ou par IA
    res.json({
      success: true,
      message: "Photo de vérification soumise. Vous serez notifié une fois validé.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la soumission.",
    })
  }
}
