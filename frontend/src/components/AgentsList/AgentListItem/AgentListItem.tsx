interface AgentListItemProps {
  name: string
  role: string
  imageSrc: string
  onClick?: () => void
  isSelected?: boolean
}

const AgentListItem = ({ name, role, imageSrc, onClick, isSelected }: AgentListItemProps) => {
  return (
    <div
      className={`cursor-pointer rounded-lg bg-gray-800 transition-all w-48 h-48 hover:bg-gray-750 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center p-6">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={name}
          className="w-24 h-24 object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="mt-4 text-center">
          <h3 className="font-semibold text-gray-100">{name}</h3>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  )
};

export default AgentListItem;

