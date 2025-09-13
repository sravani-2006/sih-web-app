{
  "name": "MarketNews",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "News headline"
    },
    "content": {
      "type": "string",
      "description": "News content"
    },
    "category": {
      "type": "string",
      "enum": [
        "price_update",
        "weather",
        "government_policy",
        "farming_tips",
        "market_analysis"
      ],
      "description": "News category"
    },
    "impact": {
      "type": "string",
      "enum": [
        "positive",
        "negative",
        "neutral"
      ],
      "description": "Impact on farmers"
    },
    "relevant_crops": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Crops affected by this news"
    }
  },
  "required": [
    "title",
    "content",
    "category"
  ]
}