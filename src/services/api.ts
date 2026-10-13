import type { Itinerary, Agency, ParseResponse, ImageSearchResult, GoogleSheetsConfig } from '../types/itinerary';
import { clientStorage } from './clientStorage';
import { parseItineraryTextClient } from './clientParser';
import { extractTextFromFileClient } from './clientDocExtractor';
import { clientImageService } from './clientImageService';
import { exportItineraryToPdfClient } from './clientPdfGenerator';

export const api = {
  // Health
  async checkHealth(): Promise<{ status: string }> {
    return { status: 'healthy (browser client storage)' };
  },

  // Agency Settings
  async getAgency(agencyId = 'default_agency'): Promise<Agency> {
    return clientStorage.getAgency(agencyId);
  },

  async updateAgency(agency: Agency): Promise<Agency> {
    return clientStorage.updateAgency(agency);
  },

  // Google Sheets
  async getGoogleSheetsConfig(): Promise<GoogleSheetsConfig> {
    return clientStorage.getGoogleSheetsConfig();
  },

  async saveGoogleSheetsConfig(config: GoogleSheetsConfig): Promise<{ status: string; message: string }> {
    return clientStorage.saveGoogleSheetsConfig(config);
  },

  async testGoogleSheetsConnection(config: GoogleSheetsConfig): Promise<{ status: string; message: string }> {
    return clientStorage.testGoogleSheetsConnection(config);
  },

  async syncWithGoogleSheets(agencyId = 'default_agency'): Promise<{ status: string; message: string }> {
    return clientStorage.syncWithGoogleSheets();
  },

  // Itineraries CRUD
  async getItineraries(params?: { search?: string; status?: string; sort_by?: string }): Promise<Itinerary[]> {
    return clientStorage.getItineraries(params);
  },

  async getItinerary(id: string): Promise<Itinerary> {
    return clientStorage.getItinerary(id);
  },

  async saveItinerary(itinerary: Itinerary): Promise<Itinerary> {
    return clientStorage.saveItinerary(itinerary);
  },

  async duplicateItinerary(id: string): Promise<Itinerary> {
    return clientStorage.duplicateItinerary(id);
  },

  async deleteItinerary(id: string): Promise<void> {
    return clientStorage.deleteItinerary(id);
  },

  // Parsing
  async parseText(text: string): Promise<ParseResponse> {
    return parseItineraryTextClient(text);
  },

  async parseFile(file: File): Promise<ParseResponse> {
    const extractedText = await extractTextFromFileClient(file);
    return parseItineraryTextClient(extractedText);
  },

  // Image & Assets
  async searchImages(query: string): Promise<ImageSearchResult[]> {
    return clientImageService.searchImages(query);
  },

  async uploadImage(file: File): Promise<{ url: string; storage_key: string }> {
    return clientImageService.uploadImage(file);
  },

  async validateImageUrl(url: string): Promise<{ valid: boolean; url: string }> {
    return clientImageService.validateImageUrl(url);
  },

  // Export PDF
  async exportPdf(itinerary: Itinerary): Promise<{ download_url: string; filename: string }> {
    const agency = await clientStorage.getAgency(itinerary.agency_id);
    return exportItineraryToPdfClient(itinerary, agency);
  },
};
