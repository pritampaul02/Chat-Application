import React from "react";
import { RiChatNewLine } from "react-icons/ri";
import { TbPinnedFilled } from "react-icons/tb";
import { BsChatLeftTextFill } from "react-icons/bs";
import { Filter, Plus, Search } from "lucide-react";

// Mock data (replace with your API data)
const MOCK_PINNED_CHATS = [
    {
        id: 1,
        name: "Akash",
        lastMessage: "Hello there!",
        time: "6:28 pm",
        unread: 1,
    },
    {
        id: 2,
        name: "Priya",
        lastMessage: "Meeting at 3pm",
        time: "5:15 pm",
        unread: 0,
    },
];

const MOCK_ALL_CHATS = Array(20)
    .fill()
    .map((_, i) => ({
        id: i + 3,
        name: `User ${i + 1}`,
        lastMessage: i % 2 === 0 ? "Hi!" : "Can we talk?",
        time: `${(i % 12) + 1}:${i % 60} ${i < 6 ? "am" : "pm"}`,
        unread: i % 4 === 0 ? 1 : 0,
    }));

const MOCK_STATUS_UPDATES = [
    { id: 1, name: "Akash", time: "10 min ago", viewed: false },
    { id: 2, name: "Priya", time: "25 min ago", viewed: true },
];

const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

const Sidebar = ({ mode = "chat" }) => {
    const config = {
        chat: {
            title: "Chats",
            headerIcons: [
                <RiChatNewLine key="chat-icon" />,
                <Filter key="filter" />,
            ],
            sections: [
                {
                    title: "PINNED CHATS",
                    icon: <TbPinnedFilled />,
                    data: MOCK_PINNED_CHATS,
                    renderItem: (item) => <ChatListItem item={item} />,
                },
                {
                    title: "ALL MESSAGES",
                    icon: <BsChatLeftTextFill />,
                    data: MOCK_ALL_CHATS,
                    renderItem: (item) => <ChatListItem item={item} />,
                },
            ],
        },
        status: {
            title: "Status",
            headerIcons: [<Plus key="plus" />],
            sections: [
                {
                    title: "RECENT UPDATES",
                    icon: <TbPinnedFilled />,
                    data: MOCK_STATUS_UPDATES.filter((item) => !item.viewed),
                    renderItem: (item) => <StatusListItem item={item} />,
                },
                {
                    title: "VIEWED UPDATES",
                    icon: <BsChatLeftTextFill />,
                    data: MOCK_STATUS_UPDATES.filter((item) => item.viewed),
                    renderItem: (item) => <StatusListItem item={item} />,
                },
            ],
        },
    };

    const { title, headerIcons, sections } = config[mode];

    return (
        <div className="w-[22rem] bg-white border border-[#5E5E5E33] h-[100vh] pb-4">
            {/* Header */}
            <div className="flex flex-col w-full px-6 pb-3">
                <div className="flex justify-between items-center h-16">
                    <h1 className="text-2xl font-medium">{title}</h1>
                    <div className="flex gap-4">
                        {headerIcons.map((icon, i) => (
                            <div
                                key={i}
                                className="cursor-pointer hover:opacity-80"
                            >
                                {icon}
                            </div>
                        ))}
                    </div>
                </div>

                {mode === "chat" && (
                    <div className="h-10 w-full flex justify-between items-center">
                        <div className="h-10 w-[82%] opacity-70 hover:opacity-100 flex border border-[#CCCFD0] items-center gap-2 rounded-[8px] bg-white px-2">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full rounded-[4px] h-full outline-none"
                            />
                        </div>
                        <button className="h-10 w-10 bg-[#00A3FF] text-white flex items-center justify-center rounded-[12px] hover:bg-[#00A3FF]/85">
                            <Plus />
                        </button>
                    </div>
                )}
            </div>

            <div className="h-[calc(100vh-150px)] overflow-y-auto customScrollbar">
                {sections.map((section, index) => (
                    <div
                        key={index}
                        className="w-full flex flex-col gap-0 pt-2"
                    >
                        <div className="flex w-full h-8 items-center pl-6 pr-6">
                            {section.icon}
                            <p className="text-[#818181] ml-2 text-[0.7rem]">
                                {section.title}
                            </p>
                        </div>

                        <div className="w-full">
                            {section.data.map((item) => (
                                <div
                                    key={item.id}
                                    className="cursor-pointer hover:bg-[#00A3FF33]"
                                >
                                    {section.renderItem(item)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ChatListItem = ({ item }) => (
    <div className="w-full flex items-center pl-6 pr-6 py-2">
        <img
            src={IMG_LINK}
            alt={item.name}
            className="rounded-full h-12 w-12 object-cover"
        />
        <div className="ml-3 flex-1">
            <div className="flex justify-between">
                <span className="text-[1rem]">{item.name}</span>
                <span className="text-xs text-gray-500">{item.time}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm text-gray-600 truncate max-w-[180px]">
                    {item.lastMessage}
                </span>
                {item.unread > 0 && (
                    <div className="bg-[#00A3FF] rounded-full h-4 w-4 flex items-center justify-center text-white text-xs">
                        {item.unread}
                    </div>
                )}
            </div>
        </div>
    </div>
);

const StatusListItem = ({ item }) => (
    <div className="w-full flex items-center pl-6 pr-6 py-3">
        <div className="relative">
            <img
                src={IMG_LINK}
                alt={item.name}
                className="rounded-full h-12 w-12 border-2 border-[#00A3FF] object-cover"
            />
            {!item.viewed && (
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-[#00A3FF] rounded-full border-2 border-white"></div>
            )}
        </div>
        <div className="ml-3">
            <p className="text-[1rem]">{item.name}</p>
            <p className="text-xs text-gray-500">{item.time}</p>
        </div>
    </div>
);

export default Sidebar;
