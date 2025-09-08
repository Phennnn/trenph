import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';

import { Map, Compass, Info, Settings, Tv, Wifi, ParkingCircle, Accessibility, Ticket, UtensilsCrossed, ShoppingBag, UserCheck, MapPin, Phone, Clock as ClockIcon, BedDouble } from 'lucide-react';

// --- INLINED ICONS (Originals kept for compatibility) ---
const FaTrain = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M416 320h-32a32 32 0 0 0-32-32V64a32 32 0 0 0-32-32H192a32 32 0 0 0-32 32v224a32 32 0 0 0-32 32H96a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h32a32 32 0 0 0 32-32v-64h192v64a32 32 0 0 0 32 32h32a32 32 0 0 0 32-32v-96a32 32 0 0 0-32-32zM192 96h128v128H192V96zm160 320H160a16 16 0 0 1-16-16v-32h224v32a16 16 0 0 1-16-16z"></path></svg>);
const FaMapMarkerAlt = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67a24 24 0 0 1-35.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>);
const FaRoute = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 0C167.6 0 96 71.6 96 160c0 2.4.1 4.8.4 7.1L0 224v112c0 17.7 14.3 32 32 32h42.7L128 416h50.4l54.3-44.3c2.2 1.1 4.5 2.1 6.9 2.9L224 416h64l-15.3-48H320v-64h-48l32-96h-64l-32 96h-48l-32-64h32c44.2 0 80-35.8 80-80S300.2 0 256 0zm0 64c9.7 0 18.5 2.1 26.5 5.8L256 128l-26.5-58.2C237.5 66.1 246.3 64 256 64zm-96 192h32l32 64h-32l-32-64zM320 256h32l-32 64h-32l32-64zm-32 128h16.7L320 416h32l-15.3-48H480c17.7 0 32-14.3 32-32V224l-96.4-56.9c.3-2.3.4-4.7.4-7.1C416 71.6 344.4 0 256 0S96 71.6 96 160c0 2.4.1 4.8.4 7.1L0 224v112c0 17.7 14.3 32 32 32h42.7L128 416h50.4l54.3-44.3c2.2 1.1 4.5 2.1 6.9 2.9L224 416h64l-15.3-48H320v-64h-48l32-96h-64l-32 96h-48l-32-64h32c44.2 0 80-35.8 80-80S300.2 0 256 0zm0 64c9.7 0 18.5 2.1 26.5 5.8L256 128l-26.5-58.2C237.5 66.1 246.3 64 256 64zm-96 192h32l32 64h-32l-32-64zM320 256h32l-32 64h-32l32-64z"></path></svg>);
const FaClock = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8l-22.4 30.8c-3.9 5.3-11.4 6.5-16.8 2.6z"></path></svg>);
const FaLandmark = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M480 207.857V48a16 16 0 0 0-16-16h-48a16 16 0 0 0-16 16v159.857L256 64l-144 95.857V48a16 16 0 0 0-16-16H48a16 16 0 0 0-16 16v159.857L0 224v240a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-96h160v96a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V224l-32-16.143zM128 448H32V240l96-64v272zm352-32h-96V176l96 64v208z"></path></svg>);
const FaExternalLinkAlt = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path></svg>);
const FaCog = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M487.4 315.7l-42.6-24.6c4.4-5.9 8.4-11.8 11.7-17.8l42.6-24.6c5.9-3.4 9.6-9.6 9.6-16.3v-49.2c0-6.7-3.7-12.9-9.6-16.3l-42.6-24.6c-3.2-6-7.3-11.9-11.7-17.8l42.6-24.6c5.9-3.4 9.6-9.6 9.6-16.3v-49.2c0-6.7-3.7-12.9-9.6-16.3l-42.6-24.6C433.6 37.3 427.7 33.3 421.7 30l-42.6-24.6c-3.4-5.9-9.6-9.6-16.3-9.6h-49.2c-6.7 0-12.9 3.7-16.3 9.6l-24.6 42.6c-6 3.2-11.9 7.3-17.8 11.7l-24.6-42.6c-3.4-5.9-9.6-9.6-16.3-9.6h-49.2c-6.7 0-12.9 3.7-16.3 9.6l-24.6 42.6C121.3 37.3 115.4 33.3 109.4 30l-42.6-24.6c-5.9-3.4-12.9-3.7-16.3 9.6L24.6 42.6C18.7 46 14.7 51.9 11.4 57.9L-31.2 82.5c-5.9 3.4-9.6 9.6-9.6 16.3v49.2c0 6.7 3.7 12.9 9.6 16.3l42.6 24.6c3.2 6 7.3 11.9 11.7 17.8l-42.6 24.6c-5.9 3.4-9.6 9.6-9.6 16.3v49.2c0 6.7 3.7 12.9 9.6 16.3l42.6 24.6c6 3.2 11.9 7.3 17.8 11.7l-42.6 24.6c-5.9 3.4-9.6 9.6-9.6 16.3v49.2c0 6.7 3.7 12.9 9.6 16.3l42.6 24.6c5.9 4.4 11.8 8.4 17.8 11.7l24.6 42.6c3.4 5.9 9.6 9.6 16.3 9.6h49.2c6.7 0 12.9-3.7 16.3-9.6l24.6-42.6c6-3.2 11.9-7.3 17.8-11.7l24.6 42.6c3.4 5.9 9.6 9.6 16.3 9.6h49.2c6.7 0 12.9-3.7 16.3-9.6l24.6-42.6c6-3.2 11.9-7.3 17.8-11.7l42.6-24.6c5.9-3.4 9.6-9.6 9.6-16.3v-49.2c0-6.7-3.7-12.9-9.6-16.3zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg>);

// --- DATA ---
const stationsData = {
  "LRT-1": { "name": "LRT Line 1", "stations": ["Fernando Poe Jr.", "Balintawak", "Monumento", "5th Avenue", "R. Papa", "Abad Santos", "Blumentritt", "Tayuman", "Bambang", "Doroteo Jose", "Carriedo", "Central Terminal", "United Nations", "Pedro Gil", "Quirino", "Vito Cruz", "Gil Puyat", "Libertad", "EDSA", "Baclaran"] },
  "LRT-2": { "name": "LRT Line 2", "stations": ["Antipolo", "Marikina-Pasig", "Santolan", "Katipunan", "Anonas", "Cubao", "Betty Go-Belmonte", "J. Ruiz", "V. Mapa", "Pureza", "Legarda", "Recto"] },
  "MRT-3": { "name": "MRT Line 3", "stations": ["North Avenue", "Quezon Avenue", "Kamuning", "Cubao", "Santolan-Annapolis", "Ortigas", "Shaw Boulevard", "Boni", "Guadalupe", "Buendia", "Ayala", "Magallanes", "Taft Avenue"] },
  "PNR": { "name": "PNR Metro Commuter Line", "stations": ["Governor Pascual", "Caloocan", "Solis", "Tutuban", "Blumentritt", "Laon Laan", "España", "Santa Mesa", "Pandacan", "Paco", "San Andres", "Vito Cruz", "Dela Rosa", "Pasay Road", "EDSA", "Nichols", "FTI", "Bicutan", "Sucat", "Alabang"] }
};

const stationCoords = {
    "LRT-1": { "Fernando Poe Jr.": [14.6582, 121.0000], "Balintawak": [14.6565, 121.0028], "Monumento": [14.6550, 120.9838], "5th Avenue": [14.6438, 120.9822], "R. Papa": [14.6361, 120.9818], "Abad Santos": [14.6291, 120.9815], "Blumentritt": [14.6230, 120.9838], "Tayuman": [14.6163, 120.9845], "Bambang": [14.6100, 120.9848], "Doroteo Jose": [14.6049, 120.9833], "Carriedo": [14.5989, 120.9819], "Central Terminal": [14.5929, 120.9813], "United Nations": [14.5833, 120.9845], "Pedro Gil": [14.5768, 120.9900], "Quirino": [14.5695, 120.9928], "Vito Cruz": [14.5625, 120.9945], "Gil Puyat": [14.5548, 120.9975], "Libertad": [14.5488, 120.9995], "EDSA": [14.5383, 121.0015], "Baclaran": [14.5323, 120.9990] },
    "LRT-2": { "Antipolo": [14.6210, 121.1265], "Marikina-Pasig": [14.6200, 121.0960], "Santolan": [14.6225, 121.0870], "Katipunan": [14.6330, 121.0740], "Anonas": [14.6310, 121.0640], "Cubao": [14.6215, 121.0520], "Betty Go-Belmonte": [14.6180, 121.0420], "J. Ruiz": [14.6130, 121.0310], "V. Mapa": [14.6060, 121.0190], "Pureza": [14.6030, 121.0080], "Legarda": [14.6010, 120.9940], "Recto": [14.6030, 120.9850] },
    "MRT-3": { "North Avenue": [14.6545, 121.0315], "Quezon Avenue": [14.6420, 121.0360], "Kamuning": [14.6340, 121.0430], "Cubao": [14.6190, 121.0510], "Santolan-Annapolis": [14.6090, 121.0570], "Ortigas": [14.5910, 121.0580], "Shaw Boulevard": [14.5830, 121.0540], "Boni": [14.5730, 121.0490], "Guadalupe": [14.5650, 121.0440], "Buendia": [14.5550, 121.0330], "Ayala": [14.5490, 121.0280], "Magallanes": [14.5410, 121.0190], "Taft Avenue": [14.5370, 121.0005] },
    "PNR": { "Governor Pascual": [14.6650, 120.9710], "Caloocan": [14.6540, 120.9780], "Solis": [14.6280, 120.9760], "Tutuban": [14.6100, 120.9740], "Blumentritt": [14.6235, 120.9840], "Laon Laan": [14.6180, 120.9900], "España": [14.6120, 120.9950], "Santa Mesa": [14.6020, 121.0080], "Pandacan": [14.5900, 121.0090], "Paco": [14.5820, 120.9970], "San Andres": [14.5720, 120.9960], "Vito Cruz": [14.5630, 120.9950], "Dela Rosa": [14.5550, 121.0050], "Pasay Road": [14.5500, 121.0150], "EDSA": [14.5420, 121.0180], "Nichols": [14.5280, 121.0250], "FTI": [14.5150, 121.0450], "Bicutan": [14.4980, 121.0500], "Sucat": [14.4780, 121.0480], "Alabang": [14.4180, 121.0450] }
};

const lineColors = { 
    "LRT-1": "#FFC107",
    "LRT-2": "#00A651",
    "MRT-3": "#0072BC",
    "PNR": "#8A2BE2"
};

const interchanges = {
    "LRT-1": { "Doroteo Jose": { line: "LRT-2", station: "Recto" }, "Blumentritt": { line: "PNR", station: "Blumentritt" }, "EDSA": { line: "MRT-3", station: "Taft Avenue" } },
    "LRT-2": { "Recto": { line: "LRT-1", station: "Doroteo Jose" }, "Cubao": { line: "MRT-3", station: "Cubao" } },
    "MRT-3": { "Taft Avenue": { line: "LRT-1", station: "EDSA" }, "Cubao": { line: "LRT-2", station: "Cubao" } },
    "PNR": { "Blumentritt": { line: "LRT-1", station: "Blumentritt" } }
};

const fareMatrix = {
  1: [13, 10], 2: [13, 10], 3: [15, 12], 4: [15, 12], 5: [18, 14], 6: [18, 14], 7: [20, 16], 8: [20, 16], 9: [20, 16], 10: [30, 24], 11: [30, 24], 12: [30, 24], 13: [30, 24], 14: [30, 24], 15: [30, 24], 16: [30, 24], 17: [30, 24], 18: [30, 24], 19: [30, 24]
};

const landmarks = [
    { name: "Rizal Park", coords: [14.5825, 120.9787], type: "National Park", imageUrl: "https://placehold.co/600x400/7C9A92/FFFFFF?text=Rizal+Park" },
    { name: "Intramuros", coords: [14.5896, 120.9745], type: "Historic Walled City", imageUrl: "https://placehold.co/600x400/AF8C53/FFFFFF?text=Intramuros" },
    { name: "National Museum Complex", coords: [14.5861, 120.9807], type: "Museum Complex", imageUrl: "https://placehold.co/600x400/D1B7A0/FFFFFF?text=National+Museum" },
    { name: "SM Mall of Asia", coords: [14.5352, 120.9822], type: "Shopping Mall", imageUrl: "https://placehold.co/600x400/003D7C/FFFFFF?text=SM+Mall+of+Asia" },
    { name: "Fort Santiago", coords: [14.5950, 120.9710], type: "Historic Fortress", imageUrl: "https://placehold.co/600x400/5C6E58/FFFFFF?text=Fort+Santiago" },
    { name: "Manila Ocean Park", coords: [14.5794, 120.9736], type: "Oceanarium", imageUrl: "https://placehold.co/600x400/0077BE/FFFFFF?text=Manila+Ocean+Park" },
    { name: "Binondo Chinatown", coords: [14.6000, 120.9760], type: "Historic District", imageUrl: "https://placehold.co/600x400/C81D25/FFFFFF?text=Binondo" },
    { name: "Greenbelt Mall", coords: [14.5520, 121.0210], type: "Shopping Mall", imageUrl: "https://placehold.co/600x400/00A651/FFFFFF?text=Greenbelt" }
];

const operatingHours = {
    "LRT-1": "4:30 AM - 10:15 PM",
    "LRT-2": "5:00 AM - 9:30 PM",
    "MRT-3": "4:40 AM - 10:10 PM",
    "PNR": "5:30 AM - 7:30 PM"
};

const pwdFriendlyStations = {
    "LRT-1": ["Fernando Poe Jr.", "EDSA", "Monumento"],
    "LRT-2": ["Recto", "Cubao"],
    "MRT-3": ["North Avenue", "Taft Avenue"],
    "PNR": ["Tutuban"]
};

// --- COMPREHENSIVE STATION DETAILS ---
const stationDetails = {
    "LRT-1": {
        "Fernando Poe Jr.": { address: "Roosevelt Ave, Quezon City", phone: "N/A", description: "Northern terminus of LRT-1, connected to SM City Grand Central.", amenities: [{ name: "Mall Connection", icon: <ShoppingBag size={20}/>, location: "SM City Grand Central", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }, { name: "PWD Facilities", icon: <Accessibility size={20}/>, available: true }] },
        "Balintawak": { address: "EDSA, Balintawak, Quezon City", phone: "N/A", description: "Connected to Balintawak Market and provides access to bus terminals.", amenities: [{ name: "Nearby Market", icon: <ShoppingBag size={20}/>, location: "Balintawak Market", available: true }, { name: "Bus Terminals", icon: <FaTrain />, location: "North Luzon Buses", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Monumento": { address: "Monumento Circle, Caloocan", phone: "N/A", description: "Located at the iconic Bonifacio Monument Circle.", amenities: [{ name: "Nearby Mall", icon: <ShoppingBag size={20}/>, location: "Victory Central Mall", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "5th Avenue": { address: "Rizal Ave. Extension, Caloocan", phone: "N/A", description: "Serves the local residential and commercial areas of Caloocan.", amenities: [{ name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "R. Papa": { address: "Rizal Ave. Extension, Tondo, Manila", phone: "N/A", description: "A standard station serving Tondo residential area.", amenities: [{ name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Abad Santos": { address: "Abad Santos Ave, Tondo, Manila", phone: "N/A", description: "Located along Abad Santos Avenue, serving nearby communities.", amenities: [{ name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Blumentritt": { address: "Rizal Ave, Santa Cruz, Manila", phone: "N/A", description: "Interchange with the PNR Blumentritt station.", amenities: [{ name: "Line Transfer", icon: <FaTrain />, location: "PNR Blumentritt", available: true }, { name: "Nearby Market", icon: <ShoppingBag size={20}/>, location: "Blumentritt Market", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Tayuman": { address: "Rizal Ave, Santa Cruz, Manila", phone: "N/A", description: "Located near the SM City San Lazaro mall.", amenities: [{ name: "Nearby Mall", icon: <ShoppingBag size={20}/>, location: "SM City San Lazaro", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Bambang": { address: "Rizal Ave, Santa Cruz, Manila", phone: "N/A", description: "Known for its proximity to stores selling medical supplies.", amenities: [{ name: "Nearby Shopping", icon: <Info size={20}/>, location: "Medical Supply Stores", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Doroteo Jose": { address: "Rizal Ave, Santa Cruz, Manila", phone: "N/A", description: "Interchange station connecting to LRT-2 Recto station.", amenities: [{ name: "Line Transfer", icon: <FaTrain />, location: "LRT-2 Recto", available: true }, { name: "Nearby Mall", icon: <ShoppingBag size={20}/>, location: "Isetann Recto", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }] },
        "Carriedo": { address: "Carriedo St, Quiapo, Manila", phone: "N/A", description: "Provides access to Quiapo Church, Plaza Miranda, and the market.", amenities: [{ name: "Nearby Landmark", icon: <FaLandmark />, location: "Quiapo Church", available: true }, { name: "Nearby Shopping", icon: <ShoppingBag size={20}/>, location: "Quiapo Market", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Central Terminal": { address: "Arroceros St, Ermita, Manila", phone: "N/A", description: "Close to the Manila City Hall and several national landmarks.", amenities: [{ name: "Nearby Landmark", icon: <FaLandmark />, location: "National Museum Complex", available: true }, { name: "Nearby Mall", icon: <ShoppingBag size={20}/>, location: "SM City Manila", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }] },
        "United Nations": { address: "Taft Ave, Ermita, Manila", phone: "N/A", description: "Serves Rizal Park and the National Museum Complex.", amenities: [{ name: "Nearby Landmark", icon: <FaLandmark />, location: "Rizal Park", available: true }, { name: "Customer Service", icon: <UserCheck size={20}/>, available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Pedro Gil": { address: "Taft Ave, Ermita, Manila", phone: "N/A", description: "Located near Robinsons Place Manila and the University of the Philippines Manila.", amenities: [{ name: "Nearby Mall", icon: <ShoppingBag size={20}/>, location: "Robinsons Place Manila", available: true }, { name: "Nearby Universities", icon: <FaLandmark />, location: "UP Manila", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Quirino": { address: "Taft Ave, Malate, Manila", phone: "N/A", description: "Provides access to the Manila Zoo and surrounding residential areas.", amenities: [{ name: "Nearby Landmark", icon: <FaLandmark />, location: "Manila Zoo", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Vito Cruz": { address: "Taft Ave, Malate, Manila", phone: "N/A", description: "Serves De La Salle University and the Rizal Memorial Sports Complex.", amenities: [{ name: "Nearby Universities", icon: <FaLandmark />, location: "De La Salle University", available: true }, { name: "Nearby Landmark", icon: <Info size={20}/>, location: "Rizal Memorial Sports Complex", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Gil Puyat": { address: "Gil Puyat Ave, Pasay", phone: "N/A", description: "A major hub for provincial bus terminals.", amenities: [{ name: "Bus Terminals", icon: <FaTrain />, location: "Nearby bus stations", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }] },
        "Libertad": { address: "Taft Ave, Pasay", phone: "N/A", description: "Located near the Libertad Market in Pasay.", amenities: [{ name: "Nearby Market", icon: <ShoppingBag size={20}/>, location: "Libertad Market", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "EDSA": { address: "Corner of EDSA and Taft Avenue, Pasay", phone: "N/A", hours: "4:30 AM - 10:15 PM", description: "A major interchange station on the LRT Line 1, connecting with the MRT-3 at Taft Avenue Station.", amenities: [{ name: "PWD Facilities", icon: <Accessibility size={20} className="text-green-600"/>, location: "Elevators and ramps", available: true }, { name: "Ticket Vending Machines", icon: <Ticket size={20} className="text-green-600"/>, location: "Concourse level", available: true }, { name: "Connection to MRT-3", icon: <FaTrain />, location: "via walkway to Taft Avenue", available: true }, { name: "Nearby Malls", icon: <ShoppingBag size={20} className="text-green-600"/>, location: "Metropoint Mall", available: true }, { name: "Nearby Hotels", icon: <BedDouble size={20}/>, location: "Several budget hotels", available: true }] },
        "Baclaran": { address: "Taft Ave, Baclaran, Parañaque", phone: "N/A", description: "Southern terminus of LRT-1, located near the bustling Baclaran Market.", amenities: [{ name: "Nearby Market", icon: <ShoppingBag size={20}/>, location: "Baclaran Market", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
    },
    "LRT-2": {
        "Antipolo": { address: "Marcos Highway, Antipolo", phone: "N/A", description: "Eastern terminus of LRT-2.", amenities: [{ name: "Nearby Mall", icon: <ShoppingBag size={20}/>, location: "Robinsons Place Antipolo", available: true }, { name: "Parking", icon: <ParkingCircle size={20}/>, available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }] },
        "Katipunan": { address: "Katipunan Ave, Quezon City", phone: "N/A", description: "Serves major universities like Ateneo de Manila and Miriam College.", amenities: [{ name: "Nearby Universities", icon: <FaLandmark />, location: "Ateneo, Miriam College", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Cubao": { address: "Araneta City, Cubao, Quezon City", phone: "N/A", description: "Interchange station with MRT-3, located within Araneta City.", amenities: [{ name: "Line Transfer", icon: <FaTrain />, location: "MRT-3 Cubao", available: true }, { name: "Mall Connection", icon: <ShoppingBag size={20}/>, location: "Gateway Mall", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }, { name: "PWD Facilities", icon: <Accessibility size={20}/>, available: true }, { name: "Nearby Hotels", icon: <BedDouble size={20}/>, location: "Novotel, Ibis Styles", available: true }] },
        "V. Mapa": { address: "Magsaysay Blvd, Santa Mesa, Manila", phone: "N/A", description: "Located near SM City Sta. Mesa and a branch of SOGO Hotel.", amenities: [{ name: "Nearby Mall", icon: <ShoppingBag size={20}/>, location: "SM City Sta. Mesa", available: true }, { name: "Nearby Hotel", icon: <BedDouble size={20}/>, location: "SOGO Hotel", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Recto": { address: "Recto Ave, Manila", phone: "N/A", description: "Western terminus and interchange station with LRT-1.", amenities: [{ name: "Line Transfer", icon: <FaTrain />, location: "LRT-1 Doroteo Jose", available: true }, { name: "Nearby Shopping", icon: <ShoppingBag size={20}/>, location: "Divisoria Market Area", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }] },
    },
    "MRT-3": {
        "North Avenue": { address: "North Avenue cor. EDSA, Quezon City", phone: "N/A", description: "Northern terminus of MRT-3, connected to major malls.", amenities: [{ name: "Mall Connection", icon: <ShoppingBag size={20}/>, location: "TriNoma, SM North EDSA", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }, { name: "PWD Facilities", icon: <Accessibility size={20}/>, available: true }, { name: "Nearby Hotels", icon: <BedDouble size={20}/>, location: "Seda Vertis North", available: true }] },
        "Quezon Avenue": { address: "Quezon Ave cor. EDSA, Quezon City", phone: "N/A", description: "Serves the Centris commercial area.", amenities: [{ name: "Nearby Mall", icon: <ShoppingBag size={20}/>, location: "Centris Station Mall", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }] },
        "Ortigas": { address: "Ortigas Ave cor. EDSA, Mandaluyong", phone: "N/A", description: "Located in the heart of the Ortigas Central Business District.", amenities: [{ name: "Mall Connection", icon: <ShoppingBag size={20}/>, location: "SM Megamall", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }, { name: "Nearby Hotels", icon: <BedDouble size={20}/>, location: "Shangri-La, Crowne Plaza", available: true }] },
        "Shaw Boulevard": { address: "Shaw Blvd cor. EDSA, Mandaluyong", phone: "N/A", description: "Connects to several high-end malls and the Greenfield District.", amenities: [{ name: "Mall Connection", icon: <ShoppingBag size={20}/>, location: "Shangri-La Plaza, Starmall", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }] },
        "Ayala": { address: "Ayala Ave cor. EDSA, Makati", phone: "N/A", description: "Serves the Ayala Center and the Makati Central Business District.", amenities: [{ name: "Mall Connection", icon: <ShoppingBag size={20}/>, location: "SM Makati, Glorietta", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }, { name: "PWD Facilities", icon: <Accessibility size={20}/>, available: true }, { name: "Nearby Hotels", icon: <BedDouble size={20}/>, location: "Fairmont, Raffles", available: true }] },
        "Taft Avenue": { address: "Taft Ave cor. EDSA, Pasay", phone: "N/A", description: "Southern terminus and interchange station with LRT-1 EDSA.", amenities: [{ name: "Line Transfer", icon: <FaTrain />, location: "LRT-1 EDSA", available: true }, { name: "Ticket Counter & Vending Machine", icon: <Ticket size={20}/>, available: true }] },
    },
    "PNR": {
        "Tutuban": { address: "Tutuban Center, Divisoria, Manila", phone: "(02) 8319-0043", hours: "Open 24/7", description: "Tutuban Station is Manila's central railway terminal operated by Philippine National Railways (PNR).", amenities: [{ name: "Free WiFi", icon: <Wifi size={20} className="text-green-600"/>, location: "Available in concourse", available: true }, { name: "Food Court & Restaurants", icon: <UtensilsCrossed size={20} className="text-green-600"/>, location: "Tutuban Center Mall", available: true }, { name: "Parking", icon: <ParkingCircle size={20} className="text-green-600"/>, location: "Tutuban Center Parking", available: true }, { name: "Tutuban Center Mall", icon: <ShoppingBag size={20} className="text-green-600"/>, location: "Connected to station", available: true }, { name: "PWD Facilities", icon: <Accessibility size={20} className="text-green-600"/>, location: "Ramps and designated areas", available: true }, { name: "Customer Service", icon: <UserCheck size={20} className="text-green-600"/>, location: "Main lobby", available: true }, { name: "Ticket Counters", icon: <Ticket size={20} className="text-green-600"/>, location: "Main concourse", available: true }, { name: "Nearby Hotels", icon: <BedDouble size={20}/>, location: "Budget hotels in the area", available: true }] },
        "Alabang": { address: "Alabang, Muntinlupa", phone: "N/A", description: "A major PNR station in the south, serving large residential and commercial areas.", amenities: [{ name: "Nearby Mall", icon: <ShoppingBag size={20}/>, location: "Festival Mall, Starmall Alabang", available: true }, { name: "Ticket Counter", icon: <Ticket size={20}/>, available: true }, { name: "Nearby Hotels", icon: <BedDouble size={20}/>, location: "Acacia Hotel, Vivere Hotel", available: true }] },
    }
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error('Error caught:', error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold text-red-600">Oops! Something Went Wrong</h1>
                        <button onClick={() => window.location.reload()} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md">Refresh Page</button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// Custom Theme Toggle Component
const ThemeToggle = ({ theme, setTheme }) => {
  const isDark = theme === 'dark';
  const handleToggle = () => { setTheme(isDark ? 'light' : 'dark'); };

  return (
    <div className="switch-container">
      <input className="toggle-checkbox" id="toggle-switch" type="checkbox" checked={isDark} onChange={handleToggle} />
      <label className="switch" htmlFor="toggle-switch">
        <div className="toggle"><div className="led" /></div>
      </label>
    </div>
  );
};

// NEW: Placeholder for Live Map
const PlatformMap = () => (
    <main className="max-w-4xl mx-auto p-4">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white/70 to-blue-50/50 dark:from-slate-800/70 dark:to-blue-900/50 backdrop-blur-sm border-white/20 shadow-lg p-6 rounded-lg text-center"
        >
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Live Platform Map</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">This feature is currently under construction.</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">A live train simulation will be available here soon!</p>
        </motion.div>
    </main>
);

function App() {
    // --- STATE MANAGEMENT ---
    const [appStarted, setAppStarted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activePage, setActivePage] = useState('planner');
    const [startLine, setStartLine] = useState('LRT-1');
    const [destinationLine, setDestinationLine] = useState('LRT-1');
    const [startStation, setStartStation] = useState(stationsData['LRT-1'].stations[0]);
    const [destinationStation, setDestinationStation] = useState(stationsData['LRT-1'].stations[1]);
    const [userType, setUserType] = useState('Regular');
    const [routeInfo, setRouteInfo] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const plannerMapRef = useRef(null);
    const landmarksMapRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const [fontSize, setFontSize] = useState('text-base');
    const [showPwdFriendly, setShowPwdFriendly] = useState(false);
    // NEW: State for Station Info page
    const [infoLine, setInfoLine] = useState('PNR');
    const [infoStation, setInfoStation] = useState('Tutuban');
    const stationMapRef = useRef(null);

    // --- FRAMER-MOTION SCROLL HOOKS ---
    const { scrollYProgress } = useScroll();
    const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    // --- DYNAMICALLY LOAD LEAFLET CSS & JS ---
    useEffect(() => {
        const loadScript = (id, src) => {
            return new Promise((resolve, reject) => {
                if (document.getElementById(id)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.id = id;
                script.src = src;
                script.onload = () => resolve();
                script.onerror = () => reject();
                document.head.appendChild(script);
            });
        };
        const loadCss = (id, href) => {
             if (!document.getElementById(id)) {
                const link = document.createElement('link');
                link.id = id;
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        }
        
        loadCss('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        loadScript('leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');

    }, []);

    // --- LIVE CLOCK EFFECT ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- GET USER LOCATION ON MOUNT ---
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                () => { 
                    console.log("Geolocation permission denied or failed. Using fallback location.");
                    setUserLocation({ lat: 14.5995, lng: 120.9842 });
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser. Using fallback location.");
            setUserLocation({ lat: 14.5995, lng: 120.9842 });
        }
    }, []);

    // --- MAP INITIALIZATION LOGIC ---
    useEffect(() => {
        if (!appStarted || !userLocation || !window.L) return;

        let mapInstance, mapRef;
        let setupFunction = null;
        let view = [userLocation.lat, userLocation.lng];
        let zoom = 13;

        const initMap = (ref, v, z, setup) => {
            if (ref.current) {
                // If a map instance already exists on the container, remove it before creating a new one.
                if (ref.current._leaflet_id) {
                    ref.current.remove();
                }
                const map = window.L.map(ref.current, { zoomControl: false }).setView(v, z);
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
                if (setup) setup(map);
                return map;
            }
            return null;
        };
        
        if (activePage === 'planner') {
            mapRef = plannerMapRef;
            setupFunction = (map) => {
                Object.keys(stationsData).forEach((line) => {
                    const coordsArray = stationsData[line].stations.map(station => stationCoords[line]?.[station]).filter(coord => coord);
                    if (coordsArray.length > 1) {
                        window.L.polyline(coordsArray, { color: lineColors[line], weight: 5, opacity: 0.7 }).addTo(map);
                    }
                });
            };
        } else if (activePage === 'landmarks') {
            mapRef = landmarksMapRef;
            view = [14.58, 120.98]; // Center on Metro Manila for landmarks
            setupFunction = (map) => {
                 landmarks.forEach(landmark => {
                    window.L.marker(landmark.coords).addTo(map).bindPopup(`<b>${landmark.name}</b><br>${landmark.type}`);
                });
                // RESTORED: Add station markers to the landmarks map
                Object.keys(stationsData).forEach(line => {
                    stationsData[line].stations.forEach(station => {
                        const coords = stationCoords[line]?.[station];
                        if (coords) {
                            const isPwd = pwdFriendlyStations[line]?.includes(station);
                            const stationIcon = window.L.divIcon({
                                className: 'station-marker',
                                html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="${lineColors[line]}" width="20" height="20" style="filter: drop-shadow(0 0 2px black);"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67a24 24 0 0 1-35.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>`,
                                iconSize: [20, 20],
                                iconAnchor: [10, 20]
                            });
                            const marker = window.L.marker(coords, { icon: stationIcon }).addTo(map).bindPopup(`<b>${station}</b><br>${stationsData[line].name}<br>${isPwd ? '<span style="color: green;">✓ PWD Accessible</span><br>' : ''}<hr class="my-1">Operating Hours: ${operatingHours[line]}`);
                            if (showPwdFriendly && isPwd) {
                                window.L.circle(coords, { radius: 100, color: 'blue', weight: 2 }).addTo(map);
                            }
                        }
                    });
                });
            }
        } else if (activePage === 'stationinfo') {
            mapRef = stationMapRef;
            const coords = stationCoords[infoLine]?.[infoStation];
            if (!coords) return;
            view = coords;
            zoom = 16;
            setupFunction = (map) => {
                window.L.marker(coords).addTo(map);
            }
        }

        if (mapRef) {
            mapInstance = initMap(mapRef, view, zoom, setupFunction);
        }

        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, [activePage, userLocation, appStarted, infoStation, infoLine, showPwdFriendly]);


    const fetchPrediction = async (totalStations) => {
        try {
            const mlData = {
                distance_km: totalStations * 1.5,
                hour_of_day: new Date().getHours(),
                day_of_week: new Date().getDay(),
                is_holiday: 0, 
                weather_idx: 1, 
                crowd_level: 0.5,
            };
            const response = await axios.post('http://localhost:3000/api/predict', mlData);
            setPrediction(response.data);
        } catch (error) {
            console.error('Prediction error:', error);
            setPrediction({ eta: 'N/A', status: 'Unavailable', travelTime: 'N/A' });
        }
    };

    const calculateFare = (stationsTraveled) => {
        if (stationsTraveled <= 0) return 0;
        const fareBracket = fareMatrix[stationsTraveled] || fareMatrix[19];
        return userType === 'Regular' ? fareBracket[0] : fareBracket[1];
    };

    const getRouteString = (line, start, end) => {
        const lineStations = stationsData[line].stations;
        const startIndex = lineStations.indexOf(start);
        const destIndex = lineStations.indexOf(end);
        const routeStations = lineStations.slice(Math.min(startIndex, destIndex), Math.max(startIndex, destIndex) + 1);
        if (startIndex > destIndex) routeStations.reverse();
        return routeStations.join(' → ');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setPrediction(null);

        if (startLine === destinationLine) {
            const lineStations = stationsData[startLine].stations;
            const startIndex = lineStations.indexOf(startStation);
            const destIndex = lineStations.indexOf(destinationStation);
            if (startIndex === destIndex) {
                 setRouteInfo({ route: "Start and destination cannot be the same.", fare: "N/A" });
                 setLoading(false);
                 return;
            }
            const stationsTraveled = Math.abs(destIndex - startIndex);
            const fare = calculateFare(stationsTraveled);
            const route = getRouteString(startLine, startStation, destinationStation);
            setRouteInfo({ route: `(${stationsData[startLine].name}) ${route}`, fare: fare });
            fetchPrediction(stationsTraveled);
        } else {
            const startLineInterchanges = interchanges[startLine];
            let bestRoute = null;
            for (const interchangeStation of Object.keys(startLineInterchanges)) {
                const connection = startLineInterchanges[interchangeStation];
                if (connection.line === destinationLine) {
                    const leg1_stations = Math.abs(stationsData[startLine].stations.indexOf(startStation) - stationsData[startLine].stations.indexOf(interchangeStation));
                    const leg2_stations = Math.abs(stationsData[destinationLine].stations.indexOf(connection.station) - stationsData[destinationLine].stations.indexOf(destinationStation));
                    const totalStations = leg1_stations + leg2_stations;
                    if (!bestRoute || totalStations < bestRoute.totalStations) {
                        bestRoute = {
                            totalStations,
                            interchange: interchangeStation,
                            connection: connection.station,
                            leg1_fare: calculateFare(leg1_stations),
                            leg2_fare: calculateFare(leg2_stations),
                        };
                    }
                }
            }
            if (bestRoute) {
                const totalFare = bestRoute.leg1_fare + bestRoute.leg2_fare;
                const route1 = getRouteString(startLine, startStation, bestRoute.interchange);
                const route2 = getRouteString(destinationLine, bestRoute.connection, destinationStation);
                const fullRoute = `(${stationsData[startLine].name}) ${route1} \n➡️ TRANSFER AT ${bestRoute.interchange}/${bestRoute.connection} ➡️\n (${stationsData[destinationLine].name}) ${route2}`;
                setRouteInfo({ route: fullRoute, fare: totalFare });
                fetchPrediction(bestRoute.totalStations);
            } else {
                setRouteInfo({ route: "No direct transfer route found between these lines.", fare: "N/A" });
            }
        }
        setLoading(false);

        if (plannerMapRef.current && plannerMapRef.current._leaflet_id) {
            const map = plannerMapRef.current.leafletElement;
            map.eachLayer((layer) => { if (layer instanceof window.L.Marker) map.removeLayer(layer); });
            const startCoords = stationCoords[startLine]?.[startStation];
            const destCoords = stationCoords[destinationLine]?.[destinationStation];
            if (startCoords && destCoords) {
                window.L.marker(startCoords).addTo(map).bindPopup(`<b>Start:</b> ${startStation}`).openPopup();
                window.L.marker(destCoords).addTo(map).bindPopup(`<b>End:</b> ${destinationStation}`);
                map.fitBounds([startCoords, destCoords], { padding: [50, 50] });
            }
        }
    };
    
    const handleUserTypeSelect = (type) => {
        if (type === 'accessibility') {
            setUserType('PWD');
            setShowPwdFriendly(true);
        } else {
            setUserType('Regular');
        }
        setAppStarted(true);
    };

    const renderWelcomeScreen = () => (
        <div className="h-screen w-screen relative">
            <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-0">
                <source src="/gradient-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center p-4">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-bold mb-4">Welcome to Tren-PH</motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-lg md:text-2xl mb-12">Please select your passenger type to begin.</motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleUserTypeSelect('regular')} className="p-6 text-white border border-white/50 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 w-full h-32 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold mb-2 uppercase tracking-wider">Regular / Student</span>
                        <span className="text-sm font-normal normal-case tracking-normal text-center px-4">Standard access to all features.</span>
                    </motion.button>
                     <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleUserTypeSelect('accessibility')} className="p-6 text-white border border-white/50 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 w-full h-32 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold mb-2 uppercase tracking-wider">Senior / PWD</span>
                        <span className="text-sm font-normal normal-case tracking-normal text-center px-4">Enhanced accessibility options.</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );

    const MapLegend = () => (
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-bold mb-2 text-sm">Legend</h4>
        <ul className="space-y-1">
          {Object.entries(lineColors).map(([line, color]) => (
            <li key={line} className="flex items-center text-xs">
              <span className="w-3 h-3 inline-block rounded-full mr-2" style={{ backgroundColor: color }}></span>
              {stationsData[line].name}
            </li>
          ))}
          <li key="landmark" className="flex items-center text-xs">
            <span className="inline-block mr-2 text-gray-600"><FaLandmark /></span>
            Landmark
          </li>
        </ul>
      </div>
    );

    const renderPlannerPage = () => (
        <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.section initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl">
                <div className="p-4 bg-gray-50 rounded-lg border mb-6">
                    <h3 className="text-center text-2xl font-bold text-gray-800">{currentTime.toLocaleTimeString()}</h3>
                    <div className="text-center text-xs text-gray-500">{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <hr className="my-2"/>
                    <div className="text-xs text-gray-600 space-y-1">
                        {Object.keys(operatingHours).map(line => (
                            <div key={line} className="flex justify-between">
                                <span>{stationsData[line].name}:</span>
                                <span>{operatingHours[line]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800"><FaTrain /> <span className="ml-2">Plan Your Journey</span></h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Line</label>
                        <select value={startLine} onChange={(e) => { setStartLine(e.target.value); setStartStation(stationsData[e.target.value].stations[0]); }} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"><option value="" disabled>Select Line</option>{Object.keys(stationsData).map((line) => (<option key={line} value={line}>{stationsData[line].name}</option>))}</select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Station</label>
                        <select value={startStation} onChange={(e) => setStartStation(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"><option value="" disabled>Select Station</option>{stationsData[startLine].stations.map((station) => (<option key={station} value={station}>{station}</option>))}</select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Destination Line</label>
                        <select value={destinationLine} onChange={(e) => { setDestinationLine(e.target.value); setDestinationStation(stationsData[e.target.value].stations[0]); }} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"><option value="" disabled>Select Line</option>{Object.keys(stationsData).map((line) => (<option key={line} value={line}>{stationsData[line].name}</option>))}</select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Destination Station</label>
                        <select value={destinationStation} onChange={(e) => setDestinationStation(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"><option value="" disabled>Select Station</option>{stationsData[destinationLine].stations.map((station) => (<option key={station} value={station}>{station}</option>))}</select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User Type</label>
                        <select value={userType} onChange={(e) => setUserType(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                            <option value="Regular">Regular</option><option value="Student">Student</option><option value="Senior">Senior Citizen</option><option value="PWD">PWD</option>
                        </select>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                         <button type="submit" disabled={loading} className="w-full py-3 mt-2 text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-400">{loading ? 'Calculating...' : 'Calculate & Predict'}</button>
                    </motion.div>
                </form>

                {routeInfo && (
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 p-4 bg-gray-50/90 rounded-lg border whitespace-pre-line">
                        <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800"><FaRoute /> <span className="ml-2">Your Trip Details</span></h3>
                        <div className="space-y-2">
                            <p className="text-sm"><strong>Route:</strong> {routeInfo.route}</p>
                            <p className="text-lg font-bold"><strong>Total Fare ({userType}):</strong> <span className="text-purple-600">PHP {routeInfo.fare}</span></p>
                        </div>
                    </motion.section>
                )}
                
                {prediction && (
                     <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-4 p-4 bg-gray-50/90 rounded-lg border">
                        <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800"><FaClock /> <span className="ml-2">Live Prediction</span></h3>
                        <div className="space-y-2">
                          <p><strong>ETA:</strong> {prediction.eta || 'N/A'}</p><p><strong>Status:</strong> {prediction.status || 'Unavailable'}</p><p><strong>Travel Time:</strong> {prediction.travelTime || 'N/A'}</p><p><small>Last updated: {new Date().toLocaleTimeString()}</small></p>
                        </div>
                    </motion.section>
                )}
            </motion.section>

            <motion.section initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl relative h-[500px] lg:h-auto">
                <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800"><FaMapMarkerAlt /> <span className="ml-2">Transit Map</span></h2>
                <div className="relative w-full h-[calc(100%-4rem)] rounded-lg overflow-hidden">
                    <div ref={plannerMapRef} className="w-full h-full bg-gray-200"></div><MapLegend />
                </div>
            </motion.section>
        </main>
    );

    const renderLandmarksPage = () => (
        <main className="max-w-7xl mx-auto p-4">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-6 rounded-lg shadow-xl relative">
                <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800"><FaLandmark /> <span className="ml-2">Explore Landmarks & Stations</span></h2>
                <div className="relative w-full h-[500px] rounded-lg overflow-hidden mb-6">
                    <div ref={landmarksMapRef} className="w-full h-full bg-gray-200"></div><MapLegend />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {landmarks.map((landmark, index) => (
                        <motion.div key={landmark.name} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} className="p-4 border rounded-lg cursor-pointer bg-gray-50 overflow-hidden" onClick={() => { if (landmarksMapRef.current && landmarksMapRef.current.leafletElement) { landmarksMapRef.current.leafletElement.setView(landmark.coords, 15); } }}>
                            <img src={landmark.imageUrl} alt={landmark.name} className="w-full h-32 object-cover rounded-md mb-3"/>
                            <h3 className="font-bold text-purple-700">{landmark.name}</h3><p className="text-sm text-gray-600">{landmark.type}</p>
                            <a href={`https://www.google.com/maps?q=${landmark.coords[0]},${landmark.coords[1]}`} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline mt-2 inline-flex items-center">View on Google Maps <FaExternalLinkAlt className="ml-1" /></a>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </main>
    );
    
    // NEW: Fully updated Station Info Page
    const renderStationInfoPage = () => {
        const details = stationDetails[infoLine]?.[infoStation];

        return (
            <main className="max-w-4xl mx-auto p-4">
                <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="bg-gradient-to-br from-white/70 to-blue-50/50 dark:from-slate-800/70 dark:to-blue-900/50 backdrop-blur-sm border-white/20 shadow-lg p-6 rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Select a Station</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Train Line</label>
                                <select value={infoLine} onChange={(e) => { setInfoLine(e.target.value); setInfoStation(stationsData[e.target.value].stations[0]); }} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white/50 dark:bg-slate-700/50 dark:text-white">
                                    {Object.keys(stationsData).map((line) => (<option key={line} value={line}>{stationsData[line].name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Station</label>
                                <select value={infoStation} onChange={(e) => setInfoStation(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white/50 dark:bg-slate-700/50 dark:text-white">
                                    {stationsData[infoLine].stations.map((station) => (<option key={station} value={station}>{station}</option>))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {details ? (
                        <motion.div key={infoStation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <div className="bg-gradient-to-br from-white/70 to-blue-50/50 dark:from-slate-800/70 dark:to-blue-900/50 backdrop-blur-sm border-white/20 shadow-lg p-6 rounded-lg mb-6">
                                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-4"><MapPin size={24} /> {infoStation} Station</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm mb-4 text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-3"><MapPin size={18} className="text-gray-500" /><span>{details.address}</span></div>
                                    <div className="flex items-center gap-3"><Phone size={18} className="text-gray-500" /><span>{details.phone}</span></div>
                                    <div className="flex items-center gap-3"><ClockIcon size={18} className="text-gray-500" /><span>{details.hours || operatingHours[infoLine]}</span></div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{details.description}</p>
                            </div>

                            <div className="bg-gradient-to-br from-white/70 to-blue-50/50 dark:from-slate-800/70 dark:to-blue-900/50 backdrop-blur-sm border-white/20 shadow-lg p-6 rounded-lg">
                                <h4 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Station Amenities</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {details.amenities.map(amenity => (
                                        <div key={amenity.name} className="p-4 bg-white/50 dark:bg-slate-900/30 rounded-lg border border-white/30 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                {amenity.icon}
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-white">{amenity.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{amenity.location}</p>
                                                </div>
                                            </div>
                                            {amenity.available && <span className="text-xs font-bold bg-green-200 text-green-800 px-2 py-1 rounded-full">Available</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-gradient-to-br from-white/70 to-yellow-50/50 dark:from-slate-800/70 dark:to-yellow-900/50 backdrop-blur-sm border-white/20 shadow-lg p-6 rounded-lg text-center">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">No Detailed Information</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Sorry, detailed information for {infoStation} is not yet available.</p>
                        </div>
                    )}
                </motion.section>
            </main>
        );
    };

    const renderSettingsPage = () => (
        <main className="max-w-4xl mx-auto p-4">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800 dark:text-white"><FaCog /> <span className="ml-2">Settings</span></h2>
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</h3>
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</h3>
                    <div className="flex space-x-2">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFontSize('text-sm')} className={`px-4 py-2 rounded-md border text-sm font-medium transition ${fontSize === 'text-sm' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border-gray-300 dark:bg-slate-700 dark:text-gray-200'}`}>Small</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFontSize('text-base')} className={`px-4 py-2 rounded-md border text-sm font-medium transition ${fontSize === 'text-base' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border-gray-300 dark:bg-slate-700 dark:text-gray-200'}`}>Medium</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFontSize('text-lg')} className={`px-4 py-2 rounded-md border text-sm font-medium transition ${fontSize === 'text-lg' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border-gray-300 dark:bg-slate-700 dark:text-gray-200'}`}>Large</motion.button>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Accessibility</h3>
                    <div className="flex items-center">
                        <input type="checkbox" id="pwd-toggle" checked={showPwdFriendly} onChange={() => setShowPwdFriendly(!showPwdFriendly)} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"/>
                        <label htmlFor="pwd-toggle" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Highlight PWD-Friendly Stations on Maps</label>
                    </div>
                </div>
            </motion.section>
        </main>
    );

    const renderMainApp = () => (
        <div className={`min-h-screen font-sans ${fontSize} ${theme === 'dark' ? 'dark bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
             <style>{`:root { --bg-light: #d6d6d6; --shadow-light-1: #ffffff; --shadow-light-2: #b0b0b0; --toggle-bg-light: linear-gradient(145deg, #d9d9d9, #bfbfbf); --bg-dark: #2a2a2a; --shadow-dark-1: #343434; --shadow-dark-2: #202020; --toggle-bg-dark: #2a2a2a; } .dark .switch-container { background: var(--bg-dark); box-shadow: inset -8px -8px 16px var(--shadow-dark-1), inset 8px 8px 16px var(--shadow-dark-2); } .dark .toggle { background: var(--toggle-bg-dark); box-shadow: -4px -4px 8px var(--shadow-dark-1), 4px 4px 8px var(--shadow-dark-2); } .dark .toggle-checkbox:checked + .switch .toggle { background: #222; box-shadow: -4px -4px 8px #343434, 4px 4px 8px #1a1a1a; } .dark .switch:hover .toggle { box-shadow: -4px -4px 12px #343434, 4px 4px 12px #1a1a1a; } .switch-container { position: relative; width: 100px; height: 40px; background: var(--bg-light); border-radius: 50px; box-shadow: inset -8px -8px 16px var(--shadow-light-1), inset 8px 8px 16px var(--shadow-light-2); } .toggle-checkbox { display: none; } .switch { position: absolute; top: 50%; left: 0; width: 100%; height: 100%; transform: translateY(-50%); border-radius: 50px; overflow: hidden; cursor: pointer; } .toggle { position: absolute; width: 52px; height: 32px; background: var(--toggle-bg-light); border-radius: 50px; top: 4px; left: 4px; box-shadow: -4px -4px 8px var(--shadow-light-1), 4px 4px 8px var(--shadow-light-2); transition: all 0.3s ease-in-out; display: flex; align-items: center; justify-content: flex-start; padding-left: 10px; } .led { width: 8px; height: 8px; background: grey; border-radius: 50%; box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2); transition: all 0.3s ease-in-out; } .toggle-checkbox:checked + .switch .toggle { left: 44px; } .toggle-checkbox:checked + .switch .led { background: #4fe855; box-shadow: 0 0 15px 4px #4fe855; } .switch:hover .toggle { box-shadow: -4px -4px 12px #ffffff, 4px 4px 12px #9b9b9b; }`}</style>
            
            <section className="relative h-64 overflow-hidden">
                 <motion.video style={{ y: videoY }} autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover" src="/gradient-video.mp4">
                </motion.video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-blue-900/30"></div>
                <div className="relative z-10 flex items-center h-full text-white text-center px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-5xl font-bold mb-2">Welcome to Tren-PH</motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-lg md:text-xl">Navigate Manila’s Rails with Ease</motion.p>
                    </div>
                </div>
            </section>

            <header className={`shadow-md p-4 flex items-center justify-between relative sticky top-0 z-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h1 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tren-PH</h1>
                <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-1 md:space-x-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('planner')} className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-md border text-xs md:text-sm font-medium transition ${activePage === 'planner' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600'}`}><Map size={16} /> <span className="hidden md:inline">Planner</span></motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('landmarks')} className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-md border text-xs md:text-sm font-medium transition ${activePage === 'landmarks' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600'}`}><Compass size={16} /> <span className="hidden md:inline">Landmarks</span></motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('stationinfo')} className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-md border text-xs md:text-sm font-medium transition ${activePage === 'stationinfo' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600'}`}><Info size={16} /> <span className="hidden md:inline">Stations</span></motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('livemap')} className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-md border text-xs md:text-sm font-medium transition ${activePage === 'livemap' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600'}`}><Tv size={16} /> <span className="hidden md:inline">Live Map</span></motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActivePage('settings')} className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-md border text-xs md:text-sm font-medium transition ${activePage === 'settings' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600'}`}><Settings size={16} /> <span className="hidden md:inline">Settings</span></motion.button>
                </nav>
                <div className="w-16 md:w-24"></div>
            </header>
            
            <div className="relative">
                <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-0">
                    <source src="/train-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10"></div>
                <div className="relative z-20">
                    {activePage === 'planner' && renderPlannerPage()}
                    {activePage === 'landmarks' && renderLandmarksPage()}
                    {activePage === 'stationinfo' && renderStationInfoPage()}
                    {activePage === 'livemap' && <PlatformMap />}
                    {activePage === 'settings' && renderSettingsPage()}
                </div>
            </div>

            <footer className="bg-gray-800 text-white p-4 mt-6 text-center">
                <p>&copy; 2025 Tren-PH. All rights reserved.</p>
            </footer>
        </div>
    );

    return (
        <ErrorBoundary>
            {appStarted ? renderMainApp() : renderWelcomeScreen()}
        </ErrorBoundary>
    );
}

export default App;
