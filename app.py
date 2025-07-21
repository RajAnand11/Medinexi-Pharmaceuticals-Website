from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Ensure the CSV file exists
CSV_FILE = 'appointments.csv'
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            'Timestamp',
            'Full Name',
            'Email',
            'Phone',
            'Date of Birth',
            'Gender',
            'Reason for Visit',
            'Insurance',
            'Additional Notes',
            'Service',
            'Doctor',
            'Appointment Date',
            'Appointment Time'
        ])

@app.route('/submit-appointment', methods=['POST'])
def submit_appointment():
    try:
        data = request.json
        
        # Get current timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Prepare row data
        row = [
            timestamp,
            data.get('fullName', ''),
            data.get('email', ''),
            data.get('phone', ''),
            data.get('dob', ''),
            data.get('gender', ''),
            data.get('reason', ''),
            data.get('insurance', ''),
            data.get('additionalNotes', ''),
            data.get('service', ''),
            data.get('doctor', ''),
            data.get('appointmentDate', ''),
            data.get('appointmentTime', '')
        ]
        
        # Append to CSV file
        with open(CSV_FILE, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(row)
        
        return jsonify({"message": "Appointment scheduled successfully!"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 