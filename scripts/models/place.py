import json
from dataclasses import dataclass, field, asdict
import re
from typing import List, Optional


@dataclass
class Description:
    content: str = ""
    source: str = "tripadvisor"  # tripadvisor|google-map|ai


@dataclass
class RegularHour:
    day: int  # 1–7 Monday to Sunday
    open: str = ""
    close: str = ""


@dataclass
class HourException:
    date: str = ""  # "YYYY-MM-DD"
    closed: Optional[bool] = None
    open: Optional[str] = None
    close: Optional[str] = None


@dataclass
class Hours:
    timezone: str = "Asia/Hong_Kong"
    regular: List[RegularHour] = field(default_factory=list)
    exceptions: Optional[List[HourException]] = None


@dataclass
class Location:
    address: str = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None


@dataclass
class Connection:
    type: str  # tripadvisor
    locationId: int


@dataclass
class Place:
    id: int
    name: str
    region: str
    category: str
    description: Description
    location: Location
    images: List[str]
    hours: Optional[Hours] = None
    rating: Optional[float] = None
    ranking: Optional[int] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    _connection: Optional[Connection] = None

    def to_dict(self):
        return asdict(self)

    def to_json(self) -> str:
        return re.sub(
            r'\{\s*"day":\s*(\d+),\s*"open":\s*"([^"]*)",\s*"close":\s*"([^"]*)"\s*\}',
            r'{ "day": \1, "open": "\2", "close": "\3" }',
            json.dumps(self.to_dict(), indent=2, ensure_ascii=False),
            flags=re.MULTILINE | re.DOTALL,
        )
