import { FavouritesService } from '../services/favourites.service';

describe('FavouritesService', () => {
  let service: FavouritesService;

  beforeEach(() => {
    localStorage.clear();
    service = new FavouritesService();
  });

  it('should add and remove favourites', () => {
    expect(service.isFavourite('123')).toBe(false);
    service.toggle('123');
    expect(service.isFavourite('123')).toBe(true);
    service.toggle('123');
    expect(service.isFavourite('123')).toBe(false);
  });
});
