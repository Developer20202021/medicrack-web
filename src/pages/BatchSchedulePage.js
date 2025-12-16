import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, Users, BookOpen, AlertCircle, ChevronRight, ExternalLink, Timer, Menu, X, ChevronDown } from 'lucide-react';

// API Base URL
const API_BASE_URL = 'https://medicrack-web-exam-496984660515.asia-south1.run.app/api';

// Utility Functions
const convertTo12Hour = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const parseDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const [hours, minutes] = timeStr.split(':');
  const date = new Date(dateStr);
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date;
};

const formatCountdown = (ms) => {
  if (ms <= 0) return 'শুরু হয়েছে';
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours} ঘণ্টা ${minutes} মিনিট বাকি`;
  } else if (minutes > 0) {
    return `${minutes} মিনিট ${seconds} সেকেন্ড বাকি`;
  } else {
    return `${seconds} সেকেন্ড বাকি`;
  }
};

// API Functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const getMyBatches = async () => {
  const response = await fetch(`${API_BASE_URL}/batch/my-batches`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch batches');
  return data;
};

const getTodaySchedule = async (batchId, date = null) => {
  const body = { batch_id: batchId };
  if (date) body.date = date;
  
  const response = await fetch(`${API_BASE_URL}/batch/today-schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch today schedule');
  return data;
};

const getScheduleHistory = async (batchId, limit = 50) => {
  const response = await fetch(`${API_BASE_URL}/batch/schedule-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ batch_id: batchId, limit })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch schedule history');
  return data;
};

const getUpcomingSchedules = async (batchId) => {
  const response = await fetch(`${API_BASE_URL}/batch/upcoming-schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ batch_id: batchId })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch upcoming schedules');
  return data;
};


// ✅ এই দুইটা function যোগ করুন
const getMonthlyAttendance = async (batchId, month = null) => {
  const body = { batch_id: batchId };
  if (month) body.month = month;
  
  const response = await fetch(`${API_BASE_URL}/attendance/monthly-calendar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch attendance');
  return data;
};

const getAvailableMonths = async (batchId) => {
  const response = await fetch(`${API_BASE_URL}/attendance/available-months`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ batch_id: batchId })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch available months');
  return data;
};

// Components
const BatchCard = ({ batch, onSelect, isSelected }) => (
  <div
    onClick={() => onSelect(batch)}
    className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all border ${
      isSelected
        ? 'bg-blue-600 border-blue-500'
        : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">{batch.batch_name}</h3>
        {batch.batch_description && (
          <p className="text-xs sm:text-sm text-gray-400 mb-2 line-clamp-2">{batch.batch_description}</p>
        )}
        <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 flex-wrap">
          {batch.batch_code && (
            <span className="px-2 py-1 bg-gray-900 rounded">কোড: {batch.batch_code}</span>
          )}
          {batch.has_current_class && (
            <span className="flex items-center gap-1 text-green-400">
              <Video size={12} /> <span className="hidden sm:inline">ক্লাস সক্রিয়</span>
            </span>
          )}
          {batch.has_current_exam && (
            <span className="flex items-center gap-1 text-yellow-400">
              <BookOpen size={12} /> <span className="hidden sm:inline">পরীক্ষা সক্রিয়</span>
            </span>
          )}
        </div>
      </div>
      <ChevronRight className={`flex-shrink-0 ml-2 ${isSelected ? 'text-white' : 'text-gray-600'}`} size={20} />
    </div>
  </div>
);

const TodayScheduleCard = ({ schedule }) => {
  const navigate = useNavigate();
  const [classCountdown, setClassCountdown] = useState('');
  const [examCountdown, setExamCountdown] = useState('');
  const [isExamStarted, setIsExamStarted] = useState(false);

  useEffect(() => {
    if (!schedule?.schedule) return;

    const updateCountdown = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      if (schedule.schedule.has_class && schedule.schedule.class_time) {
        const classTime = parseDateTime(today, schedule.schedule.class_time);
        if (classTime) {
          setClassCountdown(formatCountdown(classTime - now));
        }
      }

      if (schedule.schedule.exam && schedule.schedule.exam.exam_time) {
        const examTime = parseDateTime(today, schedule.schedule.exam.exam_time);
        if (examTime) {
          const timeDiff = examTime - now;
          setExamCountdown(formatCountdown(timeDiff));
          setIsExamStarted(timeDiff <= 0);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [schedule]);

  if (!schedule || !schedule.schedule) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <AlertCircle className="mx-auto mb-3 text-gray-500" size={48} />
        <p className="text-gray-400">আজকের জন্য কোন শিডিউল নেই</p>
      </div>
    );
  }

  const { schedule: data } = schedule;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="text-blue-400 flex-shrink-0" size={24} />
        আজকের শিডিউল
      </h3>

      {data.has_class && (
        <div className="bg-gray-900 rounded-lg p-3 sm:p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-1 break-words">{data.topic_name}</h4>
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {convertTo12Hour(data.class_time)}
                </span>
                <span className="flex items-center gap-1">
                  <Video size={14} />
                  {data.class_platform}
                </span>
              </div>
              {classCountdown && (
                <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm">
                  <Timer className="text-green-400 flex-shrink-0" size={14} />
                  <span className="text-green-400 font-semibold">{classCountdown}</span>
                </div>
              )}
            </div>
          </div>

          {data.teacher_name && (
            <div className="flex items-center gap-3 mb-3 p-2 sm:p-3 bg-gray-800 rounded-lg">
              {data.teacher_image && (
                <img src={data.teacher_image} alt={data.teacher_name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-sm sm:text-base truncate">{data.teacher_name}</p>
                {data.teacher_bio && <p className="text-xs text-gray-400 line-clamp-1">{data.teacher_bio}</p>}
              </div>
            </div>
          )}

          {data.class_platform === 'Google Meet' && data.google_meet_url && (
            <a
              href={data.google_meet_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
            >
              <ExternalLink size={16} />
              Google Meet এ যোগ দিন
            </a>
          )}

          {data.class_platform === 'Zoom' && data.zoom_id && (
            <div className="bg-gray-800 rounded p-3 space-y-1 text-xs sm:text-sm">
              <p className="text-gray-400">Zoom ID: <span className="text-white font-mono break-all">{data.zoom_id}</span></p>
              {data.zoom_password && (
                <p className="text-gray-400">Password: <span className="text-white font-mono">{data.zoom_password}</span></p>
              )}
            </div>
          )}

          {data.class_platform === 'Facebook' && data.facebook_group_link && (
            <a
              href={data.facebook_group_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
            >
              <ExternalLink size={16} />
              Facebook Group এ যোগ দিন
            </a>
          )}
        </div>
      )}

      {data.exam && (
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 sm:p-4">
          <h4 className="text-base sm:text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
            <BookOpen size={20} className="flex-shrink-0" />
            পরীক্ষা
          </h4>
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-white break-words"><span className="text-gray-400">বিষয়:</span> {data.exam.exam_subject}</p>
            <p className="text-white break-words"><span className="text-gray-400">টপিক:</span> {data.exam.exam_topic_name}</p>
            <p className="text-white"><span className="text-gray-400">ধরণ:</span> {data.exam.exam_type}</p>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <span className="text-gray-400">সময়: <span className="text-white">{convertTo12Hour(data.exam.exam_time)}</span></span>
              <span className="text-gray-400">MCQ: <span className="text-white">{data.exam.mcq_count}</span></span>
              <span className="text-gray-400">মার্কস: <span className="text-white">{data.exam.total_marks}</span></span>
            </div>
            {examCountdown && (
              <div className="mt-2 flex items-center gap-2 pt-2 border-t border-yellow-600/30">
                <Timer className="text-yellow-400 flex-shrink-0" size={14} />
                <span className="text-yellow-400 font-semibold">{examCountdown}</span>
              </div>
            )}
            {data.exam.exam_id && (
              <button
                onClick={() => isExamStarted && navigate(`/exam/${data.exam.exam_id}`)}
                disabled={!isExamStarted}
                className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                  isExamStarted
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                <BookOpen size={16} />
                {isExamStarted ? 'পরীক্ষা শুরু করুন' : 'পরীক্ষা এখনও শুরু হয়নি'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const UpcomingSchedules = ({ schedules }) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">কোন আসন্ন শিডিউল নেই</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {schedules.map((item, idx) => (
        <div key={idx} className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {item.type === 'class' ? (
                  <Video className="text-blue-400 flex-shrink-0" size={18} />
                ) : (
                  <BookOpen className="text-yellow-400 flex-shrink-0" size={18} />
                )}
                <span className={`text-xs px-2 py-1 rounded ${
                  item.type === 'class' ? 'bg-blue-900/30 text-blue-400' : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {item.type === 'class' ? 'ক্লাস' : 'পরীক্ষা'}
                </span>
              </div>
              <h4 className="text-white font-medium mb-1 text-sm sm:text-base break-words">
                {item.topic || item.subject}
              </h4>
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="flex-shrink-0" />
                  {item.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="flex-shrink-0" />
                  {item.time}
                </span>
                {item.teacher && (
                  <span className="flex items-center gap-1">
                    <Users size={12} className="flex-shrink-0" />
                    <span className="truncate">{item.teacher}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ScheduleHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">কোন ইতিহাস নেই</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div key={item.schedule_id} className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <Calendar size={12} className="flex-shrink-0" />
            {new Date(item.created_at).toLocaleDateString('bn-BD')}
          </div>

          {item.has_class && item.class && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Video className="text-blue-400 flex-shrink-0" size={16} />
                <span className="text-white font-medium text-sm sm:text-base break-words">{item.class.topic_name}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 space-y-1">
                <p className="break-words">শিক্ষক: {item.class.teacher_name}</p>
                <p>প্ল্যাটফর্ম: {item.class.class_platform}</p>
                <p>সময়: {item.class.class_time}</p>
              </div>
            </div>
          )}

          {item.has_exam && item.exam && (
            <div className="bg-gray-900 rounded p-2 sm:p-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-yellow-400 flex-shrink-0" size={16} />
                <span className="text-white font-medium text-sm sm:text-base break-words">{item.exam.exam_topic_name}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 space-y-1">
                <p className="break-words">বিষয়: {item.exam.exam_subject}</p>
                <p>ধরণ: {item.exam.exam_type}</p>
                <p>MCQ: {item.exam.mcq_count} | মার্কস: {item.exam.total_marks}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Mobile Batch Selector (Dropdown)
const MobileBatchSelector = ({ batches, selectedBatch, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">নির্বাচিত ব্যাচ</p>
          <p className="text-white font-semibold truncate">{selectedBatch?.batch_name || 'ব্যাচ নির্বাচন করুন'}</p>
        </div>
        <ChevronDown
          className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
            {batches.map((batch) => (
              <div
                key={batch.batch_id}
                onClick={() => {
                  onSelect(batch);
                  setIsOpen(false);
                }}
                className={`p-4 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0 ${
                  selectedBatch?.batch_id === batch.batch_id
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-750'
                }`}
              >
                <h3 className="text-white font-semibold mb-1 text-sm">{batch.batch_name}</h3>
                {batch.batch_code && (
                  <span className="text-xs text-gray-400">কোড: {batch.batch_code}</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


// Attendance Calendar Component
const AttendanceCalendar = ({ batchId }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (batchId) {
      loadAvailableMonths();
    }
  }, [batchId]);

  useEffect(() => {
    if (batchId && selectedMonth) {
      loadAttendance(selectedMonth);
    }
  }, [batchId, selectedMonth]);

  const loadAvailableMonths = async () => {
    try {
      const data = await getAvailableMonths(batchId);
      setAvailableMonths(data.months || []);
      if (data.months && data.months.length > 0) {
        setSelectedMonth(data.months[0].month);
      }
    } catch (err) {
      console.error('Error loading available months:', err);
    }
  };

  const loadAttendance = async (month) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMonthlyAttendance(batchId, month);
      setAttendanceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCalendar = () => {
    if (!attendanceData) return null;

    const totalDays = attendanceData.total_days;
    const calendar = attendanceData.calendar;
    const days = [];

    for (let day = 1; day <= totalDays; day++) {
      const dayData = calendar[day.toString()];
      let bgColor = 'bg-gray-700';
      let textColor = 'text-gray-400';
      let status = 'Not Marked';

      if (dayData) {
        if (dayData.type === 'Present') {
          bgColor = 'bg-green-600';
          textColor = 'text-white';
          status = 'Present';
        } else if (dayData.type === 'Absent') {
          bgColor = 'bg-red-600';
          textColor = 'text-white';
          status = 'Absent';
        }
      }

      days.push(
        <div
          key={day}
          className={`${bgColor} ${textColor} rounded-lg p-2 sm:p-3 text-center transition-all hover:scale-105 cursor-pointer`}
          title={status}
        >
          <div className="text-xs sm:text-sm font-semibold">{day}</div>
        </div>
      );
    }

    return days;
  };

  if (availableMonths.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <Calendar className="mx-auto mb-3 text-gray-500" size={48} />
        <p className="text-gray-400">এই ব্যাচে এখনো কোনো attendance নেই</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Selector */}
      <div className="bg-gray-800 rounded-lg p-4">
        <label className="block text-sm text-gray-400 mb-2">মাস নির্বাচন করুন</label>
        <select
          value={selectedMonth || ''}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          {availableMonths.map((month) => (
            <option key={month.month} value={month.month}>
              {month.month} - {month.percentage}% ({month.present}/{month.total})
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Stats */}
      {attendanceData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-white">{attendanceData.total_days}</div>
            <div className="text-xs sm:text-sm text-gray-400">মোট দিন</div>
          </div>
          <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-400">{attendanceData.present_count}</div>
            <div className="text-xs sm:text-sm text-green-400">উপস্থিত</div>
          </div>
          <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-400">{attendanceData.absent_count}</div>
            <div className="text-xs sm:text-sm text-red-400">অনুপস্থিত</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-400">{attendanceData.attendance_percentage}%</div>
            <div className="text-xs sm:text-sm text-blue-400">শতাংশ</div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">লোড হচ্ছে...</p>
        </div>
      ) : error ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={48} />
          <p className="text-red-400">{error}</p>
        </div>
      ) : attendanceData ? (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="text-blue-400" size={20} />
            {selectedMonth} - Calendar
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-gray-400">উপস্থিত</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-gray-400">অনুপস্থিত</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-700 rounded"></div>
              <span className="text-gray-400">চিহ্নিত নয়</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// Main Component
export default function BatchSchedulePage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [scheduleHistory, setScheduleHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      loadBatchData(selectedBatch.batch_id);
      setShowSidebar(false);
    }
  }, [selectedBatch]);

  const loadBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBatches();
      
      console.log('API Response:', data);
      console.log('Batches:', data.batches);
      console.log('Total Batches:', data.total_batches);
      
      setBatches(data.batches || []);
      if (data.batches && data.batches.length > 0) {
        setSelectedBatch(data.batches[0]);
      } else {
        console.warn('No batches found for this user');
      }
    } catch (err) {
      console.error('Error loading batches:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBatchData = async (batchId) => {
    setLoading(true);
    try {
      const [today, upcoming, history] = await Promise.all([
        getTodaySchedule(batchId),
        getUpcomingSchedules(batchId),
        getScheduleHistory(batchId)
      ]);
      setTodaySchedule(today);
      setUpcomingSchedules(upcoming.upcoming || []);
      setScheduleHistory(history.history || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && batches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error && batches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadBatches}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">ব্যাচ শিডিউল</h1>
              <p className="text-sm sm:text-base text-gray-400">আপনার ক্লাস এবং পরীক্ষার শিডিউল দেখুন</p>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-lg bg-gray-800 border border-gray-700"
            >
              {showSidebar ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="text-blue-400" size={24} />
                আমার ব্যাচ সমূহ
              </h2>
              <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                {batches.map((batch) => (
                  <BatchCard
                    key={batch.batch_id}
                    batch={batch}
                    onSelect={setSelectedBatch}
                    isSelected={selectedBatch?.batch_id === batch.batch_id}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {showSidebar && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowSidebar(false)}
              />
              <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-gray-800 shadow-xl overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Users className="text-blue-400" size={24} />
                      আমার ব্যাচ সমূহ
                    </h2>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-2 rounded-lg hover:bg-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {batches.map((batch) => (
                      <BatchCard
                        key={batch.batch_id}
                        batch={batch}
                        onSelect={setSelectedBatch}
                        isSelected={selectedBatch?.batch_id === batch.batch_id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedBatch ? (
              <>
                {/* Mobile Batch Selector */}
                <div className="lg:hidden">
                  <MobileBatchSelector
                    batches={batches}
                    selectedBatch={selectedBatch}
                    onSelect={setSelectedBatch}
                  />
                </div>

{/* Tabs */}
                <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 bg-gray-800 p-1 rounded-lg overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('today')}
                    className={`flex-1 whitespace-nowrap py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base ${
                      activeTab === 'today'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    আজকের শিডিউল
                  </button>
                  <button
                onClick={() => setActiveTab('attendance')}
                className={`flex-1 whitespace-nowrap py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base ${
                  activeTab === 'attendance'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                উপস্থিতি
              </button>
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 whitespace-nowrap py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base ${
                      activeTab === 'upcoming'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    আসন্ন
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 whitespace-nowrap py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base ${
                      activeTab === 'history'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    ইতিহাস
                  </button>
                </div>

                {/* Tab Content */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">লোড হচ্ছে...</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'today' && <TodayScheduleCard schedule={todaySchedule} />}
                    {activeTab === 'upcoming' && <UpcomingSchedules schedules={upcomingSchedules} />}
                    {activeTab === 'attendance' && <AttendanceCalendar batchId={selectedBatch?.batch_id} />}
                    {activeTab === 'history' && <ScheduleHistory history={scheduleHistory} />}
                  </>
                )}
              </>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 sm:p-12 text-center">
                <Users className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400 text-base sm:text-lg">কোন ব্যাচ নির্বাচন করুন</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}