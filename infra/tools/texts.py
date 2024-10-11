import os
import sqlite3

# Define the path to the chat.db file
db_path = os.path.expanduser('~/chat.db')

# Check if the database exists
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit()

# Function to execute a query and fetch results
def execute_query(query):
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Execute the query
        cursor.execute(query)
        
        # Fetch all rows from the query result
        rows = cursor.fetchall()
        
        # Get column names
        col_names = [description[0] for description in cursor.description]
        
        # Print column names and rows
        print(f"Columns: {col_names}")
        for row in rows:
            print(row)
        
        # Close the connection
        conn.close()
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")

# Main function to run the script
if __name__ == "__main__":
    # Example query to fetch messages (modify the query as needed)
    query = """
    SELECT text, datetime(date/1000000000 + strftime('%s', '2001-01-01'), 'unixepoch', 'localtime') as message_date
    FROM message
    WHERE text IS NOT NULL
    LIMIT 10;  -- Adjust the LIMIT for more/less results
    """
    
    # Execute the query
    execute_query(query)
