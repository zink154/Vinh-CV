import { useAuth } from "../hooks/useAuth"

interface AdminBarProps {
  isEditing: boolean
  onToggleEdit: () => void
  onSave: () => void
  saving: boolean
}

export default function AdminBar({
  isEditing,
  onToggleEdit,
  onSave,
  saving,
}: AdminBarProps) {
  const { user, login, logout } = useAuth()

  // Not logged in: show small login button at bottom-right
  if (!user) {
    return (
      <button
        onClick={login}
        className="fixed bottom-4 right-4 px-3 py-1.5 text-xs bg-slate-800/80 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-all backdrop-blur-sm z-50"
      >
        Admin
      </button>
    )
  }

  // Logged in: show admin toolbar
  return (
    <div className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm text-white px-4 py-2 flex items-center justify-between z-50 shadow-lg">
      <div className="flex items-center gap-3">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt=""
            className="w-7 h-7 rounded-full"
          />
        )}
        <span className="text-sm text-slate-300">
          Hi, {user.displayName?.split(" ")[0]}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleEdit}
          className={`px-4 py-1.5 text-sm rounded-full font-medium transition-all ${
            isEditing
              ? "bg-amber-500 text-white"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isEditing ? "Editing..." : "Edit Mode"}
        </button>

        {isEditing && (
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-1.5 text-sm rounded-full font-medium bg-green-500 hover:bg-green-600 text-white transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}

        <button
          onClick={logout}
          className="px-4 py-1.5 text-sm rounded-full font-medium bg-white/10 hover:bg-red-500/80 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
