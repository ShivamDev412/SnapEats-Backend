import prisma from "../../../dbConfig"

const mostOrderedItems = async () => {
    const groupedItems = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 3, 
    });
  
    const mostOrderedItemIds = groupedItems.map(item => item.menuItemId);
  
    const items = await prisma.menuItem.findMany({
      where: {
        id: {
          in: mostOrderedItemIds,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        compressedImage: true,
        store:{
            select:{
                id: true,
                name: true,
            }
        }
      },
    });

    const result = groupedItems.map(groupedItem => {
      const itemDetails = items.find(item => item.id === groupedItem.menuItemId);
      return {
        id: groupedItem.menuItemId,
        name: itemDetails?.name || '',
        image: itemDetails?.image || '',
        compressedImage: itemDetails?.compressedImage || '',
        storeId: itemDetails?.store.id || '',
        storeName: itemDetails?.store.name || '',
      };
    });
  
    return result;
  };
    
  
  export { mostOrderedItems };
  