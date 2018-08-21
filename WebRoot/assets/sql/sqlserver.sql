USE ManagementSystem
GO
CREATE TABLE tb_user
    (
      userID INT IDENTITY(1, 1)
                 NOT NULL
                 PRIMARY KEY ,
      userName NVARCHAR(128) NOT NULL ,
      phoneNumber NVARCHAR(20) NOT NULL,
      [password] NVARCHAR(50) NOT NULL ,
      organization NVARCHAR(20) NOT NULL,
      createTime DATETIME NOT NULL ,
      lastLoginTime DATETIME DEFAULT NULL ,
      [status] INT NOT NULL ,
      isOnline BIT NOT NULL
    );
 
INSERT  INTO dbo.tb_user
        ( 
          userName ,
          phoneNumber,
          [password] ,
          organization,
          createTime ,
          lastLoginTime ,
          [status] ,
          isOnline
        )
VALUES  ( 
          N'admin' , -- userName - nvarchar(128)
          N'18270581222',
          N'202cb962ac59075b964b07152d234b70' , -- password - nvarchar(8)
          N'高安行者',
          GETDATE() , -- createTime - datetime
          GETDATE() , -- lastLoginTime - datetime
          1 , -- status - int
          0  -- isOnline - bit
        )
        
        
SELECT * FROM dbo.tb_user
