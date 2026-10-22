"use client";

import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}
//모든 요소에 테두리까지 포함해서 크기 계산
*, *::before, *::after {
    box-sizing: border-box;
}
a{
    text-decoration: none;
    color: inherit;
}

ul, ol, li {
    list-style: none;
    margin: 0;
    padding: 0;
}
&::selection {
    background-color: #69826B;
    color: #F5F2E9;
  }
  
   html {
    color-scheme: light;
  }

  html, body {
    scrollbar-width: thin;
    scrollbar-color: #69826B #F5F2E9;
  }

  html::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  html::-webkit-scrollbar-track {
    background-color: #F5F2E9 !important;
  }

  html::-webkit-scrollbar-thumb {
    background-color: #69826B !important;
    border-radius: 10px;
    border: 2px solid #F5F2E9;
    background-clip: padding-box;
    transition: background-color 0.15s ease-in-out;
  }

  html::-webkit-scrollbar-thumb:hover {
    background-color: #244535 !important;
  }

`;
