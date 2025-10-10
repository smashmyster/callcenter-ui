import { TopBar } from "@/components/TopBar";

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" />
      <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#212121' }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  defaultValue="http://localhost:8787"
                  className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium">Theme</label>
                <select className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  <option>Dark</option>
                  <option>Light</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
