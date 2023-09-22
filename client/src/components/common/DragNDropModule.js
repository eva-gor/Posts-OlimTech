import React, { useCallback, useEffect, useState } from 'react';

import DropBox from './DropBox';

function DragNDrop(setFileFn) {
  const onDrop = useCallback((file) => {
    setFileFn(file[0]);
  }, []);


  return <div>
    <DropBox onDrop={onDrop} />
  </div>
}

export default DragNDrop;