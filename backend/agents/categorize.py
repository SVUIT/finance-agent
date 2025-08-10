import streamlit as st
import pandas as pd
import os
from openai import OpenAI
from dotenv import load_dotenv
# Load environment variables
load_dotenv()

st.title("Finance Agent Categorization")

upload_file = st.file_uploader("Upload a CSV file", type=["csv"])

if upload_file is not None:
    csv_file_path = upload_file.name 
    with open(csv_file_path, "wb") as f:
        f.write(upload_file.getbuffer())

    df = pd.read_csv(csv_file_path)
    st.write("Uploaded CSV Data")
    st.dataframe(df)
    prompt = """
Based on the name, created_at, transfer_purpose, classify the category (salary, food, transportation, health, education, family, apparel, etc.) of the transaction.
This is the transaction details:
name: {name}
created_at: {created_at}
transfer_purpose: {transfer_purpose}
Return only the category name, nothing else.
"""

    # return_intermediate_steps=True
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    def categorize(name, amount, created_at, transfer_purpose, transaction_type):
        try:
                # Format the prompt with the transaction details
                formatted_prompt = prompt.format(name=name, created_at=created_at, transfer_purpose=transfer_purpose)

                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that classifies financial transactions into categories."},
                        {"role": "user", "content": formatted_prompt}
                    ]
                )
                return response.choices[0].message.content.strip()
        except Exception as e:
                print(f"An error occurred: {e}")
                return None

    with st.spinner("Đang phân loại giao dịch, vui lòng chờ..."):
        df['category'] = df.apply(
            lambda row: categorize(
                row['name'],
                row['amount'],
                row['created_at'],
                row['transfer_purpose'],
                row['transaction_type']
            ),
            axis=1
        )
    st.write("Response:")
    st.dataframe(df)

