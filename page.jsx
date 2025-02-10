"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("events");
  const [currentGroup, setCurrentGroup] = useState(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showCounselingModal, setShowCounselingModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newFeedback, setNewFeedback] = useState("");
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Women's Basketball Tournament",
      date: "2025-02-15",
      location: "City Sports Center",
      category: "Basketball",
      image: "/images/basketball.jpg",
    },
    {
      id: 2,
      title: "Tennis Workshop",
      date: "2025-02-20",
      location: "Tennis Club",
      category: "Tennis",
      image: "/images/tennis.jpg",
    },
    {
      id: 3,
      title: "Soccer League Kickoff",
      date: "2025-03-01",
      location: "Community Fields",
      category: "Soccer",
      image: "/images/soccer.jpg",
    },
  ]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [counselingDate, setCounselingDate] = useState("");
  const [counselingTopics, setCounselingTopics] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      userId: "user1",
      userName: "Sarah Johnson",
      rating: 5,
      text: "Great community and amazing support!",
      timestamp: new Date("2025-01-15"),
    },
    {
      id: 2,
      userId: "user2",
      userName: "Emily Chen",
      rating: 4,
      text: "Really helpful counseling sessions.",
      timestamp: new Date("2025-01-14"),
    },
    {
      id: 3,
      userId: "user3",
      userName: "Maria Garcia",
      rating: 5,
      text: "Love the events and networking opportunities!",
      timestamp: new Date("2025-01-13"),
    },
  ]);
  const [chatGroups, setChatGroups] = useState([
    {
      id: 1,
      name: "General Discussion",
      icon: "fas fa-comments",
      members: 156,
    },
    {
      id: 2,
      name: "Basketball",
      icon: "fas fa-basketball-ball",
      members: 89,
    },
    {
      id: 3,
      name: "Tennis",
      icon: "fas fa-table-tennis",
      members: 64,
    },
    {
      id: 4,
      name: "Soccer",
      icon: "fas fa-futbol",
      members: 92,
    },
  ]);
  const [counselors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Williams",
      specialty: "Sports Psychology",
    },
    {
      id: 2,
      name: "Coach Maria Rodriguez",
      specialty: "Performance & Training",
    },
    {
      id: 3,
      name: "Lisa Chen, MSW",
      specialty: "Mental Health & Wellness",
    },
  ]);
  const [leaderboard] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      points: 1200,
      eventsCompleted: 8,
      achievements: [
        "🏆 Tournament MVP",
        "⭐ Rising Star",
        "🌟 Community Leader",
      ],
      sport: "Basketball",
      level: "Professional",
    },
    {
      id: 2,
      name: "Emily Chen",
      points: 1150,
      eventsCompleted: 7,
      achievements: ["🥇 Regional Champion", "💪 Fitness Expert"],
      sport: "Tennis",
      level: "Semi-Pro",
    },
    {
      id: 3,
      name: "Maria Garcia",
      points: 1100,
      eventsCompleted: 6,
      achievements: ["🏅 Best Team Player", "🌱 Newcomer of the Year"],
      sport: "Soccer",
      level: "Amateur",
    },
  ]);

  useEffect(() => {
    if (user) {
      fetchRegisteredEvents();
    }
  }, [user]);

  const fetchRegisteredEvents = async () => {
    try {
      const response = await fetch("/api/db/events-9150787", {
        method: "POST",
        body: JSON.stringify({
          query:
            "SELECT * FROM `events` WHERE `id` IN (SELECT `event_id` FROM `registered_events` WHERE `user_id` = ?)",
          values: [user.id],
        }),
      });
      const data = await response.json();
      setRegisteredEvents(data.map((event) => event.id));
    } catch (error) {
      console.error("Failed to fetch registered events:", error);
    }
  };

  const handleEventRegistration = async (event) => {
    try {
      await fetch("/api/db/events-9150787", {
        method: "POST",
        body: JSON.stringify({
          query:
            "INSERT INTO `events` (`id`, `title`, `date`, `location`, `category`, `image`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?)",
          values: [
            event.id,
            event.title,
            event.date,
            event.location,
            event.category,
            event.image,
            new Date().toISOString(),
          ],
        }),
      });

      await fetch("/api/db/events-9150787", {
        method: "POST",
        body: JSON.stringify({
          query:
            "INSERT INTO `registered_events` (`id`, `user_id`, `event_id`, `created_at`) VALUES (?, ?, ?, ?)",
          values: [
            crypto.randomUUID(),
            user.id,
            event.id,
            new Date().toISOString(),
          ],
        }),
      });

      setRegisteredEvents([...registeredEvents, event.id]);
      alert("Successfully registered for the event!");
    } catch (error) {
      alert("Failed to register for the event. Please try again.");
    }
  };

  const handleCounselingSubmit = async (e) => {
    e.preventDefault();
    const counselor = counselors.find(
      (c) => c.id === parseInt(selectedCounselor)
    );

    try {
      await fetch("/api/db/counseling_sessions", {
        method: "POST",
        body: JSON.stringify({
          query:
            "INSERT INTO `counseling_sessions` (`name`, `date`, `topic`) VALUES (?, ?, ?)",
          values: [counselor.name, counselingDate, counselingTopics],
        }),
      });

      alert(`Session booked with ${counselor.name} for ${counselingDate}!`);
      setShowCounselingModal(false);
      setSelectedCounselor("");
      setCounselingDate("");
      setCounselingTopics("");
    } catch (error) {
      alert("Failed to book session. Please try again.");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/db/feedback-8461177", {
        method: "POST",
        body: JSON.stringify({
          query: "INSERT INTO `feedback` (`rating`, `feedback`) VALUES (?, ?)",
          values: [newRating.toString(), newFeedback],
        }),
      });

      const newFeedbackObj = {
        id: feedbacks.length + 1,
        userId: user.id,
        userName: user.name || "Anonymous",
        rating: newRating,
        text: newFeedback,
        timestamp: new Date(),
      };
      setFeedbacks([newFeedbackObj, ...feedbacks]);
      setShowFeedbackModal(false);
      setNewRating(5);
      setNewFeedback("");
      alert("Thank you for your feedback!");
    } catch (error) {
      alert("Failed to submit feedback. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-4 text-center font-poppins">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-4 text-center font-poppins">
        Please sign in to access this page
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <nav className="bg-[#8b5cf6] p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-venus text-white text-2xl mr-2"></i>
            <span className="font-poppins text-white text-xl font-bold">
              FemSphere
            </span>
          </div>
          <div className="flex space-x-4">
            {[
              { name: "events", icon: "fas fa-calendar-alt" },
              { name: "community", icon: "fas fa-users" },
              { name: "counseling", icon: "fas fa-user-md" },
              { name: "leaderboard", icon: "fas fa-trophy" },
              { name: "feedback", icon: "fas fa-comments" },
              { name: "profile", icon: "fas fa-user" },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`text-white px-4 py-2 rounded-md font-poppins flex items-center ${
                  activeTab === tab.name ? "bg-purple-700" : ""
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
              </button>
            ))}
            <a
              href="/account/logout"
              className="text-white px-4 py-2 rounded-md font-poppins flex items-center"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Sign Out
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {showCounselingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 font-poppins">
                Book Counseling Session
              </h2>
              <form onSubmit={handleCounselingSubmit} className="space-y-4">
                <div>
                  <label className="block font-poppins mb-2">
                    Select Counselor
                  </label>
                  <select
                    value={selectedCounselor}
                    onChange={(e) => setSelectedCounselor(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Choose a Counselor</option>
                    {counselors.map((counselor) => (
                      <option key={counselor.id} value={counselor.id}>
                        {counselor.name} - {counselor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-poppins mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={counselingDate}
                    onChange={(e) => setCounselingDate(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-poppins mb-2">
                    Topics to Discuss
                  </label>
                  <textarea
                    value={counselingTopics}
                    onChange={(e) => setCounselingTopics(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCounselingModal(false)}
                    className="px-4 py-2 border rounded font-poppins"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8b5cf6] text-white rounded font-poppins"
                  >
                    Book Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-poppins font-bold text-lg mb-2">
                    {event.title}
                  </h3>
                  <p className="font-poppins text-gray-600 mb-2">
                    {event.date}
                  </p>
                  <p className="font-poppins text-gray-600 mb-2">
                    {event.location}
                  </p>
                  <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm mb-4">
                    {event.category}
                  </span>
                  <button
                    onClick={() => handleEventRegistration(event)}
                    disabled={registeredEvents.includes(event.id)}
                    className={`w-full ${
                      registeredEvents.includes(event.id)
                        ? "bg-green-500"
                        : "bg-[#8b5cf6] hover:opacity-90"
                    } text-white py-2 rounded-md transition-opacity font-poppins`}
                  >
                    {registeredEvents.includes(event.id)
                      ? "Already Registered"
                      : "Register Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "counseling" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-poppins text-2xl font-bold text-purple-800 mb-6">
              Sports Counseling
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {counselors.map((counselor) => (
                <div
                  key={counselor.id}
                  className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <i className="fas fa-user-md text-purple-800 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-poppins font-bold text-lg">
                        {counselor.name}
                      </h3>
                      <p className="font-poppins text-purple-600">
                        {counselor.specialty}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCounselor(counselor.id.toString());
                      setShowCounselingModal(true);
                    }}
                    className="w-full bg-[#8b5cf6] text-white py-2 rounded-md hover:bg-purple-700 transition-colors font-poppins"
                  >
                    Book Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "community" && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
              <h3 className="font-poppins font-bold text-lg mb-4">
                Chat Groups
              </h3>
              {chatGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setCurrentGroup(group)}
                  className={`w-full text-left p-3 rounded-md mb-2 font-poppins ${
                    currentGroup?.id === group.id
                      ? "bg-purple-100 text-purple-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <i className={`${group.icon} mr-2`}></i>
                    <span>{group.name}</span>
                    <span className="ml-auto text-sm text-gray-500">
                      {group.members}
                    </span>
                  </div>
                </button>
              ))}
              <button
                onClick={() => setShowNewGroupModal(true)}
                className="w-full mt-4 bg-[#8b5cf6] text-white py-2 rounded-md hover:bg-purple-700 font-poppins"
              >
                <i className="fas fa-plus mr-2"></i>
                New Group
              </button>
            </div>
            <div className="md:col-span-3 bg-white rounded-lg shadow-md p-6">
              {currentGroup ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <i
                        className={`${currentGroup.icon} text-2xl text-purple-800 mr-3`}
                      ></i>
                      <h2 className="font-poppins text-xl font-bold">
                        {currentGroup.name}
                      </h2>
                    </div>
                    <span className="font-poppins text-sm text-gray-500">
                      {currentGroup.members} members
                    </span>
                  </div>
                  <div className="space-y-4">
                    {messages
                      .filter((msg) => msg.groupId === currentGroup.id)
                      .map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.userId === user.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              message.userId === user.id
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100"
                            }`}
                          >
                            <p className="font-poppins text-sm">
                              {message.userName}
                            </p>
                            <p className="font-poppins">{message.text}</p>
                            <p className="font-poppins text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:border-purple-500 font-poppins"
                      placeholder="Type your message..."
                    />
                    <button
                      onClick={() => {
                        if (newMessage.trim()) {
                          setMessages([
                            ...messages,
                            {
                              groupId: currentGroup.id,
                              userId: user.id,
                              userName: user.name || "Anonymous",
                              text: newMessage,
                              timestamp: new Date(),
                            },
                          ]);
                          setNewMessage("");
                        }
                      }}
                      className="bg-[#8b5cf6] text-white px-6 py-2 rounded-md hover:bg-purple-700 font-poppins"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="font-poppins text-gray-500">
                    Select a group to start chatting
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-poppins text-2xl font-bold text-purple-800 mb-6">
              Athletes Leaderboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {leaderboard.slice(0, 3).map((player, index) => (
                <div
                  key={player.id}
                  className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-poppins font-bold text-lg">
                        {player.name}
                      </h3>
                      <p className="font-poppins text-purple-600">
                        {player.sport} • {player.level}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-poppins text-gray-600">Points</span>
                      <span className="font-poppins font-bold">
                        {player.points}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-poppins text-gray-600">Events</span>
                      <span className="font-poppins font-bold">
                        {player.eventsCompleted}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="font-poppins text-sm text-gray-600 mb-2">
                        Achievements
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {player.achievements.map((achievement, i) => (
                          <span
                            key={i}
                            className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-purple-100 rounded-full p-8">
                  <i className="fas fa-user text-purple-800 text-4xl"></i>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="font-poppins text-2xl font-bold text-purple-800 mb-6">
                    Profile Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-poppins text-gray-600">Name</p>
                      <p className="font-poppins font-bold">
                        {user.name || "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="font-poppins text-gray-600">Email</p>
                      <p className="font-poppins font-bold">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-poppins text-2xl font-bold text-purple-800">
                  Community Feedback
                </h2>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="bg-[#8b5cf6] text-white px-6 py-2 rounded-md hover:bg-purple-700 font-poppins"
                >
                  Share Feedback
                </button>
              </div>
              <div className="grid gap-6">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <i className="fas fa-user text-purple-800"></i>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-poppins font-bold text-lg">
                          {feedback.userName}
                        </h3>
                        <p className="font-poppins text-sm text-gray-600">
                          {new Date(feedback.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <i
                            key={i}
                            className="fas fa-star text-yellow-400"
                          ></i>
                        ))}
                      </div>
                    </div>
                    <p className="font-poppins text-gray-700">
                      {feedback.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 font-poppins">
                Share Your Feedback
              </h2>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block font-poppins mb-2">Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    required
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {"⭐".repeat(num)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-poppins mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 border rounded font-poppins"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8b5cf6] text-white rounded font-poppins"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MainComponent;