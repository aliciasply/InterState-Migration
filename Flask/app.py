# Import dependencies
# import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import pandas as pd
from flask import Flask, jsonify
# import datetime as dt

# Create engine
engine = create_engine("postgresql://postgres:postgres@localhost:5432/interstate_migration_db")
connection = engine.connect()
# Reflect an existing database into a new model
# Base = automap_base()

# # Reflect the tables
# Base.prepare(engine, reflect=True)

####### CHECK THIS #########
# States = Base.classes.states

app = Flask(__name__)

# Home page
@app.route("/")
def home():
    print("Server received request for 'Home' page...")
    return (
        f"<h1>Welcome to PRISM, an analysis of Inter-state Migration!</h1><br/><br/>"
        f'<b>Available Routes:</b><br/><br/>'
        f'/api/v1.0/query<br/>'
    )

# Precipitation page
@app.route("/api/v1.0/query")
def precipitation():
    
    # session = Session(engine)
    # states_test = session.query(States.index).all()
    sql = """
    SELECT *
    FROM States
    LIMIT 10
    """
    results = pd.read_sql(sql, connection)
    # results = []
    # state_source = {}
    # for x in states_test:
    #     results.append({
    #         "state_source" : x[0],
    #     })
    return jsonify(results.to_dict("record"))

if __name__ == "__main__":
    app.run(debug=True)