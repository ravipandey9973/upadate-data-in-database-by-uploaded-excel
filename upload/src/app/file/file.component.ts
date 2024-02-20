import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatListOption } from '@angular/material/list';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent implements OnInit {

 

  dataSource = new MatTableDataSource<any>();
  columns: string[] = [];
  filteredColumns: string[] = [];
  searchTerm: string = '';
  isUploaded: boolean = false;
  MetricId:string="";
  selectedRow:any
  allColumns: string[] = [];
constructor(private record :ServicesService) {}

  ngOnInit(): void {
    
    
  }


onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Extract all columns
      this.allColumns = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })[0];

      // Extract and display data for all columns
      this.dataSource.data = XLSX.utils.sheet_to_json<any>(sheet, {
        header: 1,
        defval: '',
      }).map(row => {
        const rowData: any = {};
        this.allColumns.forEach((column, index) => {
          rowData[column] = row[index];
        });
        return rowData;
      });
    };
    reader.readAsBinaryString(file);
  }
}

  
  
  
  searchColumn(): void {
    const filterValue = this.searchTerm.toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  uploadFile(): void {
    if (this.dataSource.data.length > 0) {
      Swal.fire({
        title: 'Good job!',
        text: 'File uploaded successfully!',
        icon: 'success'
      });
      this.isUploaded = true;
      const allMetricIds = this.dataSource.data.map(row => row.MetricId);
      const allIsMandatory = this.dataSource.data.map(row => row.IsMandatory);
      console.log('All Metric IDs:', allMetricIds);
      console.log('All IsMandatory:', allIsMandatory);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please choose a file before uploading!!',
        icon: 'error'
      });
    }
  }
  
 
  selectRow(row: any): void {
    this.selectedRow = row;
  }
  updateTable(): void {
    const updateData = this.dataSource.data.map(row => ({
      MetricId: row.MetricId,
      IsMandatory: row.IsMandatory
    }));
  
    // Print updateData on the console
    console.log('Update Data:', updateData);
  
    // Assuming you have a method named 'updateFile' in your 'record' service
    this.record.updatefile(updateData).subscribe(
      data => {
        // Print response from the backend on the console
        console.log('Backend Response:', data);
  
        Swal.fire({
          title: 'Good job!',
          text: 'IsManadatory column updated successfully!',
          icon: 'success'
        });
      },
      error => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update!!',
          icon: 'error'
        });
      }
    );
  }
  
  
  
}
