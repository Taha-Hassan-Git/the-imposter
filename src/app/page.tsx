export default function Home() {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mt-5">
      <form id="game-form">
        {/* form-group */}
        <div className="mb-5">
          <label htmlFor="category" className="block mb-1 font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full p-2.5 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="film">Film</option>
            <option value="animals">Animals</option>
            <option value="countries">Countries</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        <div className="mb-5">
          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-5 text-base font-medium rounded-md transition-colors duration-300"
            id="new-room-btn"
          >
            New Room
          </button>
        </div>

        <div className="mb-5">
          <label htmlFor="join-room" className="block mb-1 font-medium">
            Join room:
          </label>
          <input
            type="text"
            id="join-room"
            name="join-room"
            placeholder="e.g 376j"
            className="w-full p-2.5 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-5">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-5 text-base font-medium rounded-md transition-colors duration-300"
          >
            Join
          </button>
        </div>
      </form>
    </div>
  );
}
