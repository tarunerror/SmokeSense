import * as ExpoLocation from 'expo-location';
import { Location } from '../types/models';

class LocationService {
  private hasPermission: boolean | null = null;

  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Failed to request location permission:', error);
      this.hasPermission = false;
      return false;
    }
  }

  async getCurrentLocation(): Promise<Location | null> {
    try {
      if (this.hasPermission === null) {
        await this.requestPermission();
      }

      if (!this.hasPermission) {
        console.log('Location permission not granted');
        return null;
      }

      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      const address = await this.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
      };
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }

  private async reverseGeocode(latitude: number, longitude: number): Promise<string | undefined> {
    try {
      const results = await ExpoLocation.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length > 0) {
        const result = results[0];
        const parts = [
          result.name,
          result.street,
          result.city,
          result.region,
          result.country,
        ].filter(Boolean);
        return parts.join(', ');
      }

      return undefined;
    } catch (error) {
      console.error('Failed to reverse geocode:', error);
      return undefined;
    }
  }

  async checkPermissionStatus(): Promise<boolean> {
    try {
      const { status } = await ExpoLocation.getForegroundPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Failed to check permission status:', error);
      return false;
    }
  }
}

export const locationService = new LocationService();
