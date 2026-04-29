import { useState, useEffect, useMemo } from 'react';
import MapView from '../components/Map/MapView';
import type { MapFilters, MapLocation } from '../types/map';
import { StaticLocationRepository } from '../services/staticLocationRepository';
import { filterLocations } from '../utils/mapFilters';

const defaultFilters: MapFilters = {
    searchText: '',
    category: undefined,
    type: undefined,
    id: undefined,
    lat: undefined,
    lng: undefined,
    name: '',
    description: '',
};
