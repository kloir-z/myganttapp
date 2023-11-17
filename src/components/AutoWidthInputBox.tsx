import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  position: absolute;
  left: 0;
  display: inline-block;
`;

const AutoWidthDiv = styled.div`
  display: inline-block;
  box-sizing: border-box;
  overflow: hidden;
  min-width: 1em;
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
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const AutoWidthInputBox: React.FC<AutoWidthInputBoxProps> = ({
  value,
  onChange,
  placeholder = ''
}) => {
  const dummyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dummyRef.current) {
      dummyRef.current.textContent = value || placeholder;
    }
  }, [value, placeholder]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <InputWrapper>
      <AutoWidthDiv ref={dummyRef} data-placeholder={placeholder}></AutoWidthDiv>
      <StyledInput
        type="text"
        placeholder={placeholder}
        value={value || ''}
        onChange={handleChange}
      />
    </InputWrapper>
  );
};

export default AutoWidthInputBox;