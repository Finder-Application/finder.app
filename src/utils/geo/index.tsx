import country from './VN.json';

export interface Province {
  idProvince: string;
  name: string;
}
export interface District extends Province {
  idDistrict: string;
}
export interface Commune extends Omit<District, 'idProvince'> {
  idCommune: string;
}
export interface DataCountry {
  province: Province[];
  district: District[];
  commune: Commune[];
}

export class GeoUtils {
  private static country = country;

  static getAllProvinces(): Province[] {
    return this.country.province;
  }

  static getAllDistricts(provinceId: string): District[] {
    return this.country.district.filter(
      district => district.idProvince === provinceId,
    );
  }
  static getAllCommunes(id_district: string): Commune[] {
    return this.country.commune.filter(
      commune => commune.idDistrict === id_district,
    );
  }
  static getProvince(id_province: string): string {
    return (
      this.country.province.find(item => item.idProvince === id_province)
        ?.name || ''
    );
  }
  static getDistrict(id_district: string): string {
    return (
      this.country.district.find(item => item.idDistrict === id_district)
        ?.name || ''
    );
  }
  static getCommune(id_commune: string): string {
    return (
      this.country.commune.find(item => item.idCommune === id_commune)?.name ||
      ''
    );
  }
  static getIDProvinceByName(name: string) {
    return (
      this.country.province.find(item => item.name === name)?.idProvince || ''
    );
  }
  static getIDDistrictByName = (name: string) => {
    return (
      this.country.district.find(item => item.name === name)?.idDistrict || ''
    );
  };
  static getIDWardByName = (name: string) => {
    return (
      this.country.commune.find(item => item.name === name)?.idCommune || ''
    );
  };
}
