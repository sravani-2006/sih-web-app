{
  "name": "PriceAlert",
  "type": "object",
  "properties": {
    "crop_name": {
      "type": "string",
      "description": "Name of the crop to track"
    },
    "target_price": {
      "type": "number",
      "description": "Target price per quintal in INR"
    },
    "alert_type": {
      "type": "string",
      "enum": [
        "above",
        "below"
      ],
      "description": "Alert when price goes above or below target"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Whether alert is active"
    },
    "farmer_email": {
      "type": "string",
      "description": "Farmer's email for notifications"
    }
  },
  "required": [
    "crop_name",
    "target_price",
    "alert_type",
    "farmer_email"
  ]
}