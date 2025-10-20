interface StreamingBadgeProps {
  provider: string
}

const StreamingBadge = ({ provider }: StreamingBadgeProps) => {
  const getProviderClass = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("netflix")) return "platform-netflix"
    if (lowerName.includes("prime") || lowerName.includes("amazon")) return "platform-prime"
    if (lowerName.includes("disney")) return "platform-disney"
    if (lowerName.includes("hbo") || lowerName.includes("max")) return "platform-hbo"
    if (lowerName.includes("apple")) return "platform-apple"
    if (lowerName.includes("paramount")) return "platform-paramount"
    return "platform-default"
  }

  return <span className={`platform-badge ${getProviderClass(provider)}`}>{provider}</span>
}

export default StreamingBadge
