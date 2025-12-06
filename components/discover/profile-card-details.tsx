import { Briefcase, GraduationCap, Globe, MessageCircle } from "lucide-react"

interface Profile {
  id: number
  name: string
  age: number
  location: string
  distance: string
  origin: string
  languages: string[]
  profession: string
  education: string
  bio: string
  photos: string[]
  verified: boolean
}

export function ProfileCardDetails({ profile }: { profile: Profile }) {
  return (
    <div className="bg-card p-4 space-y-4 border-t border-border">
      {/* Bio */}
      <div>
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />À propos
        </h3>
        <p className="text-sm text-muted-foreground">{profile.bio}</p>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <span>{profile.profession}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          <span>{profile.education}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span>{profile.languages.join(", ")}</span>
        </div>
      </div>

      {/* Additional Photos */}
      {profile.photos.length > 1 && (
        <div>
          <h3 className="font-medium mb-2">Plus de photos</h3>
          <div className="grid grid-cols-3 gap-2">
            {profile.photos.slice(1).map((photo, index) => (
              <img
                key={index}
                src={photo || "/placeholder.svg"}
                alt={`${profile.name} photo ${index + 2}`}
                className="aspect-square object-cover border border-border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Ice Breakers */}
      <div>
        <h3 className="font-medium mb-2">Briseurs de glace</h3>
        <div className="space-y-2">
          <button className="w-full p-3 text-left text-sm border border-border hover:bg-muted transition-colors">
            Quel est ton plat africain préféré ?
          </button>
          <button className="w-full p-3 text-left text-sm border border-border hover:bg-muted transition-colors">
            Quelle est la tradition la plus importante dans ta famille ?
          </button>
        </div>
      </div>
    </div>
  )
}
