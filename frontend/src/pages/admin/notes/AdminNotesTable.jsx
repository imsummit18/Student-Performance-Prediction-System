import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const AdminNotesTable = ({ notes, onDelete, onEdit, selectedMatiere, students }) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: 'rgba(7,29,53,0.025)' }}>
          <TableCell sx={{ fontWeight: 850, color: '#071d35', py: 1.5 }}>Student</TableCell>
          <TableCell align="center" sx={{ fontWeight: 850, color: '#071d35', py: 1.5 }}>Module Grade</TableCell>
          <TableCell align="center" sx={{ fontWeight: 850, color: '#071d35', py: 1.5 }}>Project Grade</TableCell>
          <TableCell align="center" sx={{ fontWeight: 850, color: '#071d35', py: 1.5 }}>Attendance</TableCell>
          <TableCell align="center" sx={{ fontWeight: 850, color: '#071d35', py: 1.5 }}>Presence</TableCell>
          <TableCell align="right" sx={{ fontWeight: 850, color: '#071d35', py: 1.5 }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {selectedMatiere && students.length > 0 ? students.map((student) => {
          const note = notes.find((item) => item.etudiant.id === student.id);
          return (
            <TableRow key={student.id} hover sx={{ '&:last-child td': { border: 0 }, '& td': { borderColor: 'rgba(7,29,53,0.06)' } }}>
              <TableCell sx={{ fontWeight: 750 }}>{student.first_name} {student.last_name}</TableCell>
              <TableCell align="center">{note?.note_module ?? '-'}</TableCell>
              <TableCell align="center">{note?.note_devoir_projet ?? '-'}</TableCell>
              <TableCell align="center">{note?.assiduite ?? '-'}</TableCell>
              <TableCell align="center">{note?.presence ?? '-'}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(note || { etudiant: student, matiere: { id: selectedMatiere } })} sx={{ mr: 0.5, bgcolor: 'rgba(82,109,245,0.08)', color: '#526df5', '&:hover': { bgcolor: 'rgba(82,109,245,0.16)' } }}><EditIcon fontSize="small" /></IconButton>
                {note && <IconButton onClick={() => onDelete(note.id)} sx={{ bgcolor: 'rgba(239,68,68,0.08)', color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.16)' } }}><DeleteIcon fontSize="small" /></IconButton>}
              </TableCell>
            </TableRow>
          );
        }) : (
          <TableRow><TableCell colSpan={6} align="center" sx={{ py: 7, color: 'text.secondary' }}>{selectedMatiere ? 'No students available for this subject' : 'Select a subject to display grades'}</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default AdminNotesTable;
