import React from 'react';
import MarkTeacherAttendanceModal from './MarkTeacherAttendanceModal';

export default function TeacherAttendanceSessionDetailModal({
  session,
  isOpen,
  onClose,
  onUpdateSession,
  onDeleteSession,
  teachers = [],
  attendanceTimings
}) {
  return (
    <MarkTeacherAttendanceModal
      isOpen={isOpen}
      onClose={onClose}
      session={session}
      teachers={teachers}
      onSaveTeacherAttendance={onUpdateSession}
      onUpdateSession={onUpdateSession}
      onDeleteSession={onDeleteSession}
      attendanceTimings={attendanceTimings}
    />
  );
}
