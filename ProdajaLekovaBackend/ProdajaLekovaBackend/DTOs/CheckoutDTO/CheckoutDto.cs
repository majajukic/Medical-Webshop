﻿using System.ComponentModel.DataAnnotations;

namespace ProdajaLekovaBackend.DTOs.CheckoutDTO
{
    public class CheckoutDto
    {
        [Required]
        public decimal UkupanIznos { get; set; }
    }
}
