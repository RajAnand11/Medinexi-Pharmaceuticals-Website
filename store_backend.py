from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

ORDERS_FILE = 'orders.csv'

# Create orders.csv if it doesn't exist
if not os.path.exists(ORDERS_FILE):
    with open(ORDERS_FILE, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Address', 
                        'Payment Method', 'Items', 'Total Amount', 'Status'])

@app.route('/submit-order', methods=['POST'])
def submit_order():
    try:
        data = request.json
        
        # Generate order ID
        order_id = str(uuid.uuid4())
        
        # Format current date
        order_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Format items as a string
        items_str = '; '.join([f"{item['name']} x{item['quantity']} (${item['price']})" for item in data['items']])
        
        # Save order to CSV
        with open(ORDERS_FILE, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                order_id,
                order_date,
                data['customerName'],
                data['email'],
                data['phone'],
                data['address'],
                data['paymentMethod'],
                items_str,
                data['totalAmount'],
                'Pending'
            ])
        
        return jsonify({
            'success': True,
            'orderId': order_id,
            'message': 'Order placed successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True) 