import React from "react";

function TwitchPlaysPokemonPanel(props) {
    const users = [
      { name: 'Mstrbojangl3s', vote: 'b' },
      { name: 'Kyddz', vote: 'anarchy' },
      { name: 'Bws41', vote: 'b' },
      { name: 'Faith', vote: 'anarchy' },
      { name: 'Touptar', vote: 'b' },
      { name: 'Sverioramoebe', vote: 'left' },
      { name: 'Harblngr', vote: 'democracy' },
      { name: 'Downwiththesi', vote: 'right' },
      { name: 'Towerunb', vote: 'up' },
      { name: 'Odrquy132', vote: 'democracy' },
      { name: 'Darkjesal', vote: 'r' },
      { name: 'Bluediegl', vote: 'democracy' },
      { name: 'Capo1dg', vote: 'r' },
      { name: 'Rushifiedba', vote: 'anarchy' },
      { name: 'Ulcyuubt', vote: 'r' },
      { name: 'B2badare', vote: 'democracy' },
      { name: 'Go3sauer', vote: 'r' },
    ];
  
    return (
      <div className="bg-gray-800 text-white p-4 font-mono text-sm bg-slate-900">
  <script src="https://cdn.tailwindcss.com"></script>
  <h2 className="text-xl font-bold mb-2">Twitch Plays Pokemon</h2>
        <p className="mb-4">6d 17h 46m 27s</p>
        <div className="flex mb-4">
          <div className="w-1/2 pr-2">
            <div className="bg-gray-700 h-4 rounded-full">
              <div className="bg-red-500 h-full rounded-full" style={{width: '70%'}}></div>
            </div>
            <p className="text-center">Anarchy</p>
          </div>
          <div className="w-1/2 pl-2">
            <div className="bg-gray-700 h-4 rounded-full">
              <div className="bg-blue-500 h-full rounded-full" style={{width: '30%'}}></div>
            </div>
            <p className="text-center">Democracy</p>
          </div>
        </div>
        <div className="space-y-1">
          {users.map((user, index) => (
            <div key={index} className="flex justify-between">
              <span className="truncate">{user.name}</span>
              <span>{user.vote}</span>
            </div>
          ))}
        </div>
      </div>
    );

  
}
  
export default TwitchPlaysPokemonPanel;
