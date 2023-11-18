import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setDisplayName} from '../reduxComponents/store';
import { debounce } from 'lodash';

const InputWrapper = styled.div`
  position: absolute;
  left: 0;
  display: inline-block;
`;

const AutoWidthDiv = styled.div`
  display: inline-block;
  box-sizing: border-box;
  overflow: hidden;
  min-width: 2em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  font-size: 0.8rem;
  padding: 2px 5px;
  white-space: nowrap;
  opacity: 0;
  &::before {
    content: '';
  }
  &:empty::before {
    content: attr(data-placeholder);
  }
`;

const StyledInput = styled.input`
  position: absolute;
  top: 0;
  font-size: 0.8rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  left: 0;
  color: #000000d0;
  box-sizing: border-box;
  width: 100%;
  padding: 2px 4px;
  background: none;
  border: none;
  &:focus {
    outline: none;
    text-decoration:underline;
  }
`;

interface AutoWidthInputBoxProps {
  entryId : string;
}

const AutoWidthInputBox: React.FC<AutoWidthInputBoxProps> = ({
  entryId,
}) => {
  const storeDisplayName = useSelector((state: RootState) => state.wbsData[entryId]?.displayName);
  const dispatch = useDispatch();
  const [localDisplayName, setLocalDisplayName] = useState(storeDisplayName);
  const [isEditing, setIsEditing] = useState(false);
  const dummyRef = useRef<HTMLDivElement>(null);
  const placeholder = '    '

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (dummyRef.current) {
      dummyRef.current.textContent = localDisplayName || placeholder;
    }
  }, [localDisplayName, placeholder]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalDisplayName(e.target.value);
  };

  useEffect(() => {
    if (!isEditing) {setLocalDisplayName(storeDisplayName)}
  }, [storeDisplayName, isEditing]);

  const syncToStore = useCallback(() => {
    if (isEditing) {
      dispatch(setDisplayName({ id: entryId, displayName: localDisplayName }));
    }
  }, [entryId, localDisplayName, dispatch, isEditing]);
  
  const debouncedSyncToStore = useCallback(debounce(syncToStore, 100), [syncToStore]);
  
  useEffect(() => {
    debouncedSyncToStore();
    return () => debouncedSyncToStore.cancel();
  }, [debouncedSyncToStore]);

  const handleDoubleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <InputWrapper>
      <AutoWidthDiv ref={dummyRef} data-placeholder={placeholder}></AutoWidthDiv>
      <StyledInput
        type="text"
        placeholder={placeholder}
        value={localDisplayName}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onDoubleClick={handleDoubleClick}
      />
    </InputWrapper>
  );
};

export default AutoWidthInputBox;