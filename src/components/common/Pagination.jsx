import React from 'react';
import { Pagination, Box } from '@mui/material';

export default function CustomPagination({ count, page, onChange }) {
  return (
    <Box className="flex justify-center py-6">
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        shape="rounded"
      />
    </Box>
  );
}
