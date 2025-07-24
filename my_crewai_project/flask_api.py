#!/usr/bin/env python3
"""
Flask API wrapper for CrewAI System
Optimized for free hosting platforms like Render, Fly.io, Koyeb
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import logging
from api_wrapper import run_crew

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "CrewAI Backend API",
        "version": "1.0.0"
    })

@app.route('/health', methods=['GET'])
def health():
    """Detailed health check"""
    return jsonify({
        "status": "healthy",
        "environment": os.environ.get('NODE_ENV', 'development'),
        "groq_configured": bool(os.environ.get('GROQ_API_KEY')),
        "model": os.environ.get('GROQ_MODEL_NAME', 'llama3-70b-8192')
    })

@app.route('/api/crew', methods=['POST'])
def trigger_crew():
    """Trigger CrewAI workflow"""
    try:
        # Validate request
        if not request.is_json:
            return jsonify({
                "success": False,
                "error": "Content-Type must be application/json"
            }), 400
        
        data = request.get_json()
        topic = data.get('topic')
        
        if not topic:
            return jsonify({
                "success": False,
                "error": "Topic is required"
            }), 400
        
        # Log the request
        logger.info(f"Processing CrewAI request for topic: {topic}")
        
        # Run CrewAI workflow
        result = run_crew(topic)
        
        # Log the result
        if result.get('success'):
            logger.info(f"CrewAI workflow completed successfully for topic: {topic}")
        else:
            logger.error(f"CrewAI workflow failed for topic: {topic}, error: {result.get('error')}")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Unexpected error in trigger_crew: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}"
        }), 500

@app.route('/api/crew', methods=['GET'])
def crew_info():
    """Get information about available crew types"""
    return jsonify({
        "available_crews": [
            {
                "type": "content-marketing",
                "description": "Content planning, writing, and editing workflow",
                "agents": ["Content Planner", "Content Writer", "Editor"],
                "estimated_time": "2-5 minutes"
            }
        ],
        "default_topic": "AI implementation in the investment industry"
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == '__main__':
    # Get port from environment variable (required for most free hosting platforms)
    port = int(os.environ.get('PORT', 5000))
    
    # Check if required environment variables are set
    if not os.environ.get('GROQ_API_KEY'):
        logger.warning("GROQ_API_KEY not set - CrewAI workflows will fail")
    
    logger.info(f"Starting Flask server on port {port}")
    
    # Run the app
    app.run(
        host='0.0.0.0',  # Required for deployment
        port=port,
        debug=os.environ.get('NODE_ENV') == 'development'
    ) 