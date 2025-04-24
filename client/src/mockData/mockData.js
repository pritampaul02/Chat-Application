const mockData = [
    {
        "id": 1,
        "name": "User 1",
        "info": "27 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 2,
        "name": "User 2",
        "info": "18 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 3,
        "name": "User 3",
        "info": "20 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 4,
        "name": "User 4",
        "info": "28 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 5,
        "name": "User 5",
        "info": "21 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 6,
        "name": "User 6",
        "info": "22 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 7,
        "name": "User 7",
        "info": "12 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 8,
        "name": "User 8",
        "info": "21 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 9,
        "name": "User 9",
        "info": "28 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 10,
        "name": "User 10",
        "info": "25 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 11,
        "name": "User 11",
        "info": "21 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 12,
        "name": "User 12",
        "info": "23 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 13,
        "name": "User 13",
        "info": "26 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 14,
        "name": "User 14",
        "info": "12 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 15,
        "name": "User 15",
        "info": "2 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 16,
        "name": "User 16",
        "info": "9 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 17,
        "name": "User 17",
        "info": "14 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 18,
        "name": "User 18",
        "info": "13 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 19,
        "name": "User 19",
        "info": "26 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 20,
        "name": "User 20",
        "info": "5 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 21,
        "name": "User 21",
        "info": "3 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 22,
        "name": "User 22",
        "info": "13 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 23,
        "name": "User 23",
        "info": "3 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 24,
        "name": "User 24",
        "info": "17 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 25,
        "name": "User 25",
        "info": "15 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 26,
        "name": "User 26",
        "info": "11 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 27,
        "name": "User 27",
        "info": "30 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 28,
        "name": "User 28",
        "info": "27 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 29,
        "name": "User 29",
        "info": "14 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 30,
        "name": "User 30",
        "info": "25 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 31,
        "name": "User 31",
        "info": "8 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 32,
        "name": "User 32",
        "info": "2 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 33,
        "name": "User 33",
        "info": "29 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 34,
        "name": "User 34",
        "info": "22 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 35,
        "name": "User 35",
        "info": "1 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 36,
        "name": "User 36",
        "info": "21 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 37,
        "name": "User 37",
        "info": "13 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 38,
        "name": "User 38",
        "info": "8 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 39,
        "name": "User 39",
        "info": "22 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 40,
        "name": "User 40",
        "info": "25 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 41,
        "name": "User 41",
        "info": "13 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 42,
        "name": "User 42",
        "info": "5 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 43,
        "name": "User 43",
        "info": "3 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 44,
        "name": "User 44",
        "info": "8 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 45,
        "name": "User 45",
        "info": "16 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 46,
        "name": "User 46",
        "info": "10 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 47,
        "name": "User 47",
        "info": "17 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 48,
        "name": "User 48",
        "info": "23 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 49,
        "name": "User 49",
        "info": "3 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 50,
        "name": "User 50",
        "info": "22 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 51,
        "name": "User 51",
        "info": "16 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 52,
        "name": "User 52",
        "info": "10 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 53,
        "name": "User 53",
        "info": "18 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 54,
        "name": "User 54",
        "info": "26 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 55,
        "name": "User 55",
        "info": "14 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 56,
        "name": "User 56",
        "info": "29 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 57,
        "name": "User 57",
        "info": "30 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 58,
        "name": "User 58",
        "info": "28 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 59,
        "name": "User 59",
        "info": "13 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 60,
        "name": "User 60",
        "info": "28 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 61,
        "name": "User 61",
        "info": "3 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 62,
        "name": "User 62",
        "info": "26 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 63,
        "name": "User 63",
        "info": "25 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 64,
        "name": "User 64",
        "info": "12 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 65,
        "name": "User 65",
        "info": "18 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 66,
        "name": "User 66",
        "info": "28 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 67,
        "name": "User 67",
        "info": "15 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 68,
        "name": "User 68",
        "info": "16 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 69,
        "name": "User 69",
        "info": "23 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 70,
        "name": "User 70",
        "info": "12 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 71,
        "name": "User 71",
        "info": "19 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 72,
        "name": "User 72",
        "info": "3 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 73,
        "name": "User 73",
        "info": "17 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 74,
        "name": "User 74",
        "info": "6 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 75,
        "name": "User 75",
        "info": "30 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 76,
        "name": "User 76",
        "info": "24 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 77,
        "name": "User 77",
        "info": "17 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 78,
        "name": "User 78",
        "info": "3 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 79,
        "name": "User 79",
        "info": "6 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 80,
        "name": "User 80",
        "info": "25 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 81,
        "name": "User 81",
        "info": "7 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 82,
        "name": "User 82",
        "info": "26 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 83,
        "name": "User 83",
        "info": "23 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 84,
        "name": "User 84",
        "info": "19 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 85,
        "name": "User 85",
        "info": "26 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 86,
        "name": "User 86",
        "info": "8 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 87,
        "name": "User 87",
        "info": "1 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 88,
        "name": "User 88",
        "info": "8 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 89,
        "name": "User 89",
        "info": "26 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 90,
        "name": "User 90",
        "info": "18 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 91,
        "name": "User 91",
        "info": "2 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 92,
        "name": "User 92",
        "info": "5 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 93,
        "name": "User 93",
        "info": "3 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 94,
        "name": "User 94",
        "info": "25 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 95,
        "name": "User 95",
        "info": "8 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    },
    {
        "id": 96,
        "name": "User 96",
        "info": "3 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 97,
        "name": "User 97",
        "info": "28 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 98,
        "name": "User 98",
        "info": "10 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 99,
        "name": "User 99",
        "info": "3 mutual friend",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": true
    },
    {
        "id": 100,
        "name": "User 100",
        "info": "4 mutual friends",
        "image": "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
        "isFriend": false
    }
];

export default mockData;