// Placeholder DashboardMockup component
// This should be replaced with your actual DashboardMockup component

export function DashboardMockup() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="text-sm text-slate-500">Dashboard Preview</div>
        </div>
      </div>
      <div className="p-8">
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200" />
            <div className="h-24 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200" />
            <div className="h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-slate-200" />
          </div>
          <div className="h-32 bg-slate-50 rounded-xl border border-slate-200 mt-6" />
        </div>
      </div>
    </div>
  );
}