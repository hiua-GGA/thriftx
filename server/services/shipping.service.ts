import shippo from 'shippo';
import { IOrder } from '../models/Order';
import { config } from '../config';

// Initialize Shippo client
const shippoClient = shippo(config.shippo.apiKey);

interface IAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  email: string;
  phone?: string;
}

interface IParcel {
  length: number;
  width: number;
  height: number;
  weight: number;
}

class ShippingService {
  /**
   * Create a shipping label using Shippo
   */
  async createShippingLabel(
    order: IOrder,
    fromAddress: IAddress,
    toAddress: IAddress,
    parcel: IParcel
  ) {
    try {
      // Create addresses in Shippo
      const shippoFromAddress = await shippoClient.address.create({
        name: fromAddress.name,
        street1: fromAddress.street,
        city: fromAddress.city,
        state: fromAddress.state,
        zip: fromAddress.zip,
        country: fromAddress.country,
        email: fromAddress.email,
        phone: fromAddress.phone
      });

      const shippoToAddress = await shippoClient.address.create({
        name: toAddress.name,
        street1: toAddress.street,
        city: toAddress.city,
        state: toAddress.state,
        zip: toAddress.zip,
        country: toAddress.country,
        email: toAddress.email,
        phone: toAddress.phone
      });

      // Create shipment
      const shipment = await shippoClient.shipment.create({
        address_from: shippoFromAddress,
        address_to: shippoToAddress,
        parcels: [{
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
          distance_unit: 'in',
          weight: parcel.weight,
          mass_unit: 'lb'
        }],
        async: false
      });

      // Get shipping rates
      const rates = shipment.rates.sort((a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount));

      // Purchase label with the lowest rate
      const transaction = await shippoClient.transaction.create({
        rate: rates[0].object_id,
        label_file_type: 'PDF',
        async: false
      });

      return {
        labelUrl: transaction.label_url,
        trackingNumber: transaction.tracking_number,
        trackingUrl: this.getTrackingUrl(transaction.tracking_number, rates[0].provider),
        rateId: rates[0].object_id,
        estimatedDays: rates[0].estimated_days,
        carrier: rates[0].provider,
        serviceName: rates[0].servicelevel.name,
        price: parseFloat(rates[0].amount)
      };
    } catch (error) {
      console.error('Error creating shipping label:', error);
      throw new Error('Failed to create shipping label');
    }
  }

  /**
   * Get available shipping rates
   */
  async getShippingRates(
    fromAddress: IAddress,
    toAddress: IAddress,
    parcel: IParcel
  ) {
    try {
      const shipment = await shippoClient.shipment.create({
        address_from: {
          name: fromAddress.name,
          street1: fromAddress.street,
          city: fromAddress.city,
          state: fromAddress.state,
          zip: fromAddress.zip,
          country: fromAddress.country,
          email: fromAddress.email,
          phone: fromAddress.phone
        },
        address_to: {
          name: toAddress.name,
          street1: toAddress.street,
          city: toAddress.city,
          state: toAddress.state,
          zip: toAddress.zip,
          country: toAddress.country,
          email: toAddress.email,
          phone: toAddress.phone
        },
        parcels: [{
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
          distance_unit: 'in',
          weight: parcel.weight,
          mass_unit: 'lb'
        }],
        async: false
      });

      return shipment.rates.map((rate: any) => ({
        id: rate.object_id,
        carrier: rate.provider,
        service: rate.servicelevel.name,
        price: parseFloat(rate.amount),
        currency: rate.currency,
        estimatedDays: rate.estimated_days
      }));
    } catch (error) {
      console.error('Error getting shipping rates:', error);
      throw new Error('Failed to get shipping rates');
    }
  }

  /**
   * Track a shipment
   */
  async trackShipment(trackingNumber: string, carrier: string) {
    try {
      const tracking = await shippoClient.track.get_status(carrier, trackingNumber);
      
      return {
        status: tracking.tracking_status.status,
        statusDetails: tracking.tracking_status.status_details,
        location: tracking.tracking_status.location,
        timestamp: tracking.tracking_status.status_date,
        trackingHistory: tracking.tracking_history.map((history: any) => ({
          status: history.status,
          statusDetails: history.status_details,
          location: history.location,
          timestamp: history.status_date
        }))
      };
    } catch (error) {
      console.error('Error tracking shipment:', error);
      throw new Error('Failed to track shipment');
    }
  }

  /**
   * Validate an address
   */
  async validateAddress(address: IAddress) {
    try {
      const validation = await shippoClient.address.validate(address);
      return {
        isValid: validation.validation_results.is_valid,
        messages: validation.validation_results.messages,
        suggestedAddress: validation.validation_results.is_valid ? null : {
          street: validation.street1,
          city: validation.city,
          state: validation.state,
          zip: validation.zip,
          country: validation.country
        }
      };
    } catch (error) {
      console.error('Error validating address:', error);
      throw new Error('Failed to validate address');
    }
  }

  /**
   * Get tracking URL based on carrier
   */
  private getTrackingUrl(trackingNumber: string, carrier: string): string {
    const carrierUrls: { [key: string]: string } = {
      'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'FEDEX': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
    };

    return carrierUrls[carrier.toUpperCase()] || '';
  }
}

export const shippingService = new ShippingService(); 