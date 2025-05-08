import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types';

interface Column {
  id: keyof Omit<User, 'id'>;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 250 },
  { id: 'email', label: 'Email', minWidth: 250 },
  { id: 'created_at', label: 'Signed Up', minWidth: 150 },
  { id: 'email_verified_at', label: 'Verification Status', minWidth: 210, align: 'center'},
];

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const getInitials = useInitials();

  useEffect(() => {
    fetch(`/users?page=${page + 1}&per_page=${rowsPerPage}&search=${search}&sort_column=${sortColumn}&sort_direction=${sortDirection}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setTotal(data.totalCount);
      });
  }, [page, rowsPerPage, search, sortColumn, sortDirection]);

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h5" fontWeight="600">
          Users
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search users..."
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Paper elevation={1} sx={{ borderRadius: 3 }}>
        <TableContainer sx={{ maxHeight: 550, maxWidth: 850 }}>
          <Table stickyHeader aria-label="user table" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    onClick={() => handleSort(column.id)}
                    sx={{
                      width: column.minWidth,
                      backgroundColor: '#eeeeee',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                      padding: '12px 16px',
                    }}
                  >
                    <Box sx={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: column.align === 'right' ? 'flex-end' : 'flex-start',
                      width: '100%',
                    }}>
                      <Typography fontWeight="bold" sx={{ mr: 1 }}>{column.label}</Typography>
                      <Box sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: sortColumn === column.id ? 'primary.main' : 'action.disabled',
                        marginLeft: 'auto',
                      }}>
                        {sortColumn === column.id ? (
                          sortDirection === 'desc' ? (
                            <ArrowDownwardIcon fontSize="small" />
                          ) : (
                            <ArrowUpwardIcon fontSize="small" />
                          )
                        ) : (
                          <FilterListIcon fontSize="small" />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
              users.map((user, index) => (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={user.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc',
                    '&:hover': { backgroundColor: '#f1f1f1' },
                  }}
                >
                  {columns.map((column) => {
                    let value = user[column.id];
                    if (column.id === 'name') {
                      return (
                        <TableCell key={column.id} align={column.align || 'left'}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <Typography>{user.name}</Typography>
                          </Box>
                        </TableCell>
                      );
                    }

                    if (column.id === 'email_verified_at') {
                      value = value ? '✅' : '❌';
                    } else if (column.id === 'created_at' && value) {
                      value = value ? new Date(value as string | number).toLocaleDateString() : '';
                    }

                    return (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
};

export default UserTable;