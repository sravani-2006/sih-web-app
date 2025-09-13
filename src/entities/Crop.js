{
  "name": "Crop",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the crop"
    },
    "variety": {
      "type": "string",
      "description": "Variety/type of the crop"
    },
    "current_price": {
      "type": "number",
      "description": "Current market price per quintal in INR"
    },
    "previous_price": {
      "type": "number",
      "description": "Previous day price per quintal in INR"
    },
    "season": {
      "type": "string",
      "enum": [
        "kharif",
        "rabi",
        "summer"
      ],
      "description": "Growing season"
    },
    "mandi_location": {
      "type": "string",
      "description": "Primary mandi location"
    },
    "trend": {
      "type": "string",
      "enum": [
        "rising",
        "falling",
        "stable"
      ],
      "description": "Current price trend"
    },
    "demand": {
      "type": "string",
      "enum": [
        "high",
        "medium",
        "low"
      ],
      "description": "Current market demand"
    }
  },
  "required": [
    "name",
    "current_price"
  ]
}
export default {
  name: "Crop",
  type: "object",}