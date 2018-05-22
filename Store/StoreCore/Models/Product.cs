using System;
using System.Collections.Generic;

namespace StoreCore.Models
{
    public partial class Product
    {
        public uint Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Img { get; set; }
        public string Imgs { get; set; }
        public string Detial { get; set; }
    }
}
