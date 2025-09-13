{
  "name": "Mandi",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the mandi"
    },
    "location": {
      "type": "string",
      "description": "City/district location"
    },
    "district": {
      "type": "string",
      "description": "District name"
    },
    "contact_number": {
      "type": "string",
      "description": "Contact phone number"
    },
    "market_days": {
      "type": "string",
      "description": "Days when market operates"
    },
    "specialization": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Main crops traded"
    },
    "facilities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Available facilities"
    }
  },
  "required": [
    "name",
    "location",
    "district"
  ]
}