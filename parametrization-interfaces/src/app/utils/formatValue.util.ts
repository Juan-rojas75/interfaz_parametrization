export  function formatValue(value: any): string {
    if (typeof value === "boolean") {
      return value ? "✔️ Sí" : "❌ No"; // Para booleanos
    }
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return value.join(", "); // Para arrays
      }
      return value.name;
    }
    return value ?? "—";
  }