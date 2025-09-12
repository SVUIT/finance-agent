from datetime import datetime
from typing import Union, Optional

def _ordinal_suffix(day: int) -> str:
    # xử lý 11,12,13 -> always 'th'
    if 11 <= (day % 100) <= 13:
        return "th"
    if day % 10 == 1:
        return "st"
    if day % 10 == 2:
        return "nd"
    if day % 10 == 3:
        return "rd"
    return "th"

def format_datetime(
    dt_in: Union[str, datetime],
    include_seconds: bool = True,
    use_at: bool = True,
    parse_formats: Optional[list] = None,
) -> str:
    """
    Convert "2025-03-12 14:20:00" -> "12th March 2025 at 14:20:00" (default).
    - include_seconds: nếu False -> "14:20"
    - use_at: nếu True -> thêm " at " giữa ngày và giờ
    - parse_formats: list format để thử parse nếu input là string
    """
    if parse_formats is None:
        parse_formats = [
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%d %H:%M",
            "%Y-%m-%d",
        ]

    # nếu truyền string -> thử parse
    if isinstance(dt_in, str):
        dt = None
        for fmt in parse_formats:
            try:
                dt = datetime.strptime(dt_in, fmt)
                break
            except ValueError:
                continue
        if dt is None:
            raise ValueError(f"Unsupported date format: {dt_in!r}")
    else:
        dt = dt_in

    day = dt.day
    suffix = _ordinal_suffix(day)
    month = dt.strftime("%B")   # March, April, ...
    year = dt.year

    if include_seconds:
        time_part = dt.strftime("%H:%M:%S")
    else:
        time_part = dt.strftime("%H:%M")

    sep = " at " if use_at else " "
    return f"{day}{suffix} {month} {year}{sep}{time_part}"