# Import dependencies
# import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import pandas as pd
from flask import Flask, jsonify, render_template
from config import user, pw, port
# import datetime as dt

# Create engine
engine = create_engine(f'postgresql://{user}:{pw}@localhost:{port}/interstate_migration_db')
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
@app.route("/index.html")
def home():
    print("Server received request for 'Home' page...")
    # return (
    #     f"<h1>Welcome to PRISM, an analysis of Inter-state Migration!</h1><br/><br/>"
    #     f'<b>Available Routes:</b><br/><br/>'
    #     f'/api/v1.0/query<br/>'
    # )
    return render_template("index.html")

@app.route("/Alexei.html")
def alexei():
    return render_template("Alexei.html")

@app.route("/Justin.html")
def justin():
    return render_template("Justin.html")

@app.route("/Alicia.html")
def alicia():
    return render_template("Alicia.html")

@app.route("/Rob.html")
def rob():
    return render_template("Rob.html")

# Make new routes for top 5 states then order by and group by state name

# Data visualization
@app.route("/api/v1.0/query")
@app.route("/api/v1.0/query/origin/<state>")
@app.route("/api/v1.0/query/<state>")
def visualization(state=""):
    
    # session = Session(engine)
    # states_test = session.query(States.index).all()

    ###### This works ######
    # sql = """
    # SELECT *
    # FROM States
    # LIMIT 10
    # """
    ##########################

    sql = """
    SELECT *
    FROM states_clean
    """
    if state != "":
        sql += f'''
         WHERE "To_State"='{state}'
         '''
    sql += " LIMIT 10"

    print(sql)
    results = pd.read_sql(sql, connection)
    # results = []
    # state_source = {}
    # for x in states_test:
    #     results.append({
    #         "state_source" : x[0],
    #     })
    return jsonify(results.to_dict("records"))

if __name__ == "__main__":
    app.run(debug=True)