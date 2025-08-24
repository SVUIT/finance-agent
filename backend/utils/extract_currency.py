import re

def extract_amount_currency(amount_str):
    # Remove commas for easier processing
    amount_str = amount_str.replace(',', '')

    # Use regex to find the numerical part and any non-digit characters (currency)
    match = re.match(r'(\D*)(\d+\.?\d*)(.*)', amount_str)

    if match:
        currency_prefix = match.group(1)
        amount = float(match.group(2))
        currency_suffix = match.group(3)

        # Combine prefix and suffix to get the full currency symbol
        currency = currency_prefix + currency_suffix
        return amount, currency.strip()
    else:
        return None, None