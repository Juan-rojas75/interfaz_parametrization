export  function iosFormat(value: string): string {
    const lowercaseValue = value.toLowerCase();
    if (lowercaseValue.includes("windows")) {
      return "Windows"
    }
    else if (lowercaseValue.includes("mac")) {
      return "Mac"
    }
    else if (lowercaseValue.includes("linux")) {
      return "Linux"
    }
    else {
      return "Desconocido"
    }
}

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(date);
  };