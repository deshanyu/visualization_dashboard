# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, render_template, jsonify
import pandas as pd

engine = create_engine("sqlite:///belly_button_biodiversity.sqlite", echo=False)

# Reflect Database into ORM class
Base = automap_base()
Base.prepare(engine, reflect=True)
Samples_metadata = Base.classes.samples_metadata
Otu = Base.classes.otu
Samples = Base.classes.samples

session = Session(engine)

app = Flask(__name__)

@app.route("/")
def homepage():
    #Return the homepage
    return render_template("index.html")

@app.route("/names")
def names():
#Return a json list of sample names from the dataset
    sample_names=Samples.__table__.columns.keys()[1:]
    return jsonify(sample_names)

@app.route("/otu")
#Return a json list of otus
def otu():
    otu_desc=session.query(Otu.lowest_taxonomic_unit_found).all()
    otu=[ "%s" % x for x in otu_desc ][1:]
    return jsonify(otu) 

@app.route("/metadata/<sample>") 
def metadata(sample):
    #Grab the numerical sample id
    sample_id=int(sample.split("BB_")[1])
    # Query all sample metadata
    results = session.query(Samples_metadata).all()

    # Create a json list of all sample metadata
    all_metadata = []
    for result in results:
        if result.SAMPLEID==sample_id:
            sample_dict = {}
            sample_dict["AGE"] = result.AGE
            sample_dict["BBTYPE"] = result.BBTYPE
            sample_dict["ETHNICITY"] = result.ETHNICITY
            sample_dict["GENDER"] = result.GENDER
            sample_dict["LOCATION"] = result.LOCATION
            sample_dict["SAMPLEID"] = result.SAMPLEID
            all_metadata.append(sample_dict)      
    return jsonify(all_metadata)

@app.route("/wfreq/<sample>") 
def wfreq(sample):
    sample_id=int(sample.split("BB_")[1])
    results=session.query(Samples_metadata).all()
    for result in results:
        if result.SAMPLEID==sample_id:
            sample_wfreq=result.WFREQ
    return jsonify(sample_wfreq)

@app.route("/samples/<sample>") 
def samples(sample):
    df = pd.read_sql_query("SELECT * FROM samples", engine)
    df=df.sort_values(sample,ascending=False)
    
    sample_values = {}
    sample_values["otu_id"] = [int(i) for i in df['otu_id'].values] ## Convert the datatype from Int64 to integer
    sample_values[sample] = [int(i) for i in df[sample].values]
    
    return jsonify(sample_values)

if __name__ == "__main__":
    app.run(debug=True)  