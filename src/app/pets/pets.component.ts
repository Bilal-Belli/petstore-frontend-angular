import { Component, OnInit } from '@angular/core';
import { PetsService } from './pets.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pet } from '../../lib/types';
import { GrpcPet, grpcPetCategoryFromJSON, grpcPetStatusFromJSON } from '../../generated/src/proto/K';

type FrontPet = {
  id?: number;
  name: string;
  category: string;
  tags: string;
  photoUrls: string;
  status: string;
};

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class PetsComponent implements OnInit {
  pets: Pet[] = [];

  newPet: FrontPet = {
    name: '',
    category: '',
    tags: '',
    photoUrls: '',
    status: '',
  };

  editingPet: FrontPet | null = null; // For editing

  constructor(private petsService: PetsService) {}

  ngOnInit() {
    this.fetchPets();
  }

  // fetchPets() {
  //   this.petsService.getPets().subscribe((data) => {
  //     this.pets = data;
  //   });
  // }
  fetchPets() {
    this.petsService.getPets().subscribe((data: GrpcPet[]) => {
      this.pets = data.map((grpcPet) => ({
        id: grpcPet.id,
        name: grpcPet.name ?? '',
        category: grpcPet.category?.toString() ?? '',
        tags: grpcPet.tags ?? '',
        photoUrls: grpcPet.photoUrls ?? [],
        status: grpcPet.status?.toString() ?? '',
      }));
    });
  }


 createPet() {
  const grpcPet: GrpcPet = {
    name: this.newPet.name,
    category: grpcPetCategoryFromJSON(this.newPet.category),
    photoUrls: this.newPet.photoUrls
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url !== ''),
    tags: this.newPet.tags,
    status: grpcPetStatusFromJSON(this.newPet.status),
  };

  const encoded = GrpcPet.encode(grpcPet).finish();

  console.log('Encoded Protobuf bytes:', encoded);
  console.log('Decoded again for verification:', GrpcPet.decode(encoded));

  this.petsService.createPet(grpcPet).subscribe(() => {
    this.newPet = {
      name: '',
      category: '',
      tags: '',
      photoUrls: '',
      status: '',
    };
    this.fetchPets(); // optional
  });
}

  deletePet(id?: number) {
    this.petsService.deletePet(id);
  }

  editPet(pet: Pet) {
    this.editingPet = { ...pet, photoUrls: pet.photoUrls.join(',') }; // Clone pet data for editing
  }

  updatePet() {
    if (!this.editingPet || !this.editingPet.id) return;

    this.petsService
      .updatePet(this.editingPet.id, {
        ...this.editingPet,
        photoUrls: this.editingPet.photoUrls
          .split(',')
          .filter((url: string) => url.trim() !== ''),
      })
      .subscribe(() => {
        this.editingPet = null; // Reset editing
      });
  }

  cancelEdit() {
    this.editingPet = null;
  }
}
