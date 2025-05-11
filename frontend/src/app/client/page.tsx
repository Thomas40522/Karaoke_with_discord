import Image from "next/image";
import { backend_endpoint_default } from "@/endpoints";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import './page.css';
import Client from "./client";
import { Suspense } from 'react';


export default function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Client/>
    </Suspense>
  );
}
